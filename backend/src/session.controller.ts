import {
  BadRequestException,
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Logger,
  Post,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GeminiService, SessionReport } from './gemini.service';
import { Session } from './entities/session.entity';
import { User } from './entities/user.entity';
import { Report } from './entities/report.entity';
import { ProgressEntry } from './entities/progress-entry.entity';

interface SessionRequest {
  height: number;
  weight: number;
  bmi: number;
  fitness_experience: 'beginner' | 'intermediate' | 'advanced';
  therapy_cause: string;
  goal: string;
  accuracy_rate: number;
  activation_rate: number;
  pulse_rate: number;
  sessionId?: string;
  patientId?: string;
}

/**
 * Session Controller - Generates AI-powered physiotherapy session reports
 * Accepts patient details + IoT session metrics and returns structured report + adaptive plan
 */
@Controller('session')
export class SessionController {
  private readonly logger = new Logger(SessionController.name);

  constructor(
    private readonly geminiService: GeminiService,
    @InjectRepository(Session)
    private readonly sessionRepo: Repository<Session>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Report)
    private readonly reportRepo: Repository<Report>,
    @InjectRepository(ProgressEntry)
    private readonly progressRepo: Repository<ProgressEntry>,
  ) {}

  @Post('create-meeting')
  async createMeeting(
    @Body() body: { doctorId?: string },
  ): Promise<{ success: boolean; code?: string; sessionId?: string; message?: string }> {
    if (!body.doctorId) {
      throw new BadRequestException('doctorId is required');
    }

    const doctor = await this.userRepo.findOne({
      where: { id: body.doctorId, role: 'doctor' },
    });
    if (!doctor) {
      throw new BadRequestException('Doctor not found');
    }

    let code: string;
    // Ensure unique meeting code
    // eslint-disable-next-line no-constant-condition
    while (true) {
      code = Math.random().toString(36).slice(2, 8).toUpperCase();
      const existing = await this.sessionRepo.findOne({ where: { code } });
      if (!existing) break;
    }

    const session = this.sessionRepo.create({
      code,
      doctor,
      startedAt: new Date(),
    });
    const saved = await this.sessionRepo.save(session);

    return {
      success: true,
      code,
      sessionId: saved.id,
    };
  }

  @Post('join-meeting')
  async joinMeeting(
    @Body() body: { patientId?: string; code?: string },
  ): Promise<{ success: boolean; sessionId?: string; code?: string; message?: string }> {
    const rawCode = (body.code || '').trim().toUpperCase();
    if (!rawCode) {
      throw new BadRequestException('code is required');
    }

    const session = await this.sessionRepo.findOne({ where: { code: rawCode } });
    if (!session) {
      throw new BadRequestException('Invalid or expired session code');
    }

    if (body.patientId) {
      const patient = await this.userRepo.findOne({ where: { id: body.patientId } });
      if (patient && !session.patient) {
        session.patient = patient;
      }
    }

    if (!session.startedAt) {
      session.startedAt = new Date();
    }

    const saved = await this.sessionRepo.save(session);

    return {
      success: true,
      sessionId: saved.id,
      code: saved.code,
    };
  }

  /**
   * POST /session/generate-report
   * Generates physiotherapy session report and adaptive plan
   * 
   * Body:
   * {
   *   "height": 172,
   *   "weight": 72,
   *   "bmi": 24.3,
   *   "fitness_experience": "advanced",
   *   "therapy_cause": "Post ACL recovery",
   *   "goal": "Achieve 80 degree knee flexion",
   *   "accuracy_rate": 78,
   *   "activation_rate": 66
   * }
   */
  @Post('generate-report')
  async generateReport(@Body() body: SessionRequest): Promise<SessionReport> {
    // Validate input
    this.validateInput(body);

    this.logger.log(
      `📊 Generating session report for patient: ${body.fitness_experience} fitness, goal: "${body.goal}"`,
    );

    try {
      const report = await this.geminiService.generateSessionReport({
        height: body.height,
        weight: body.weight,
        bmi: body.bmi,
        fitness_experience: body.fitness_experience,
        therapy_cause: body.therapy_cause,
        goal: body.goal,
        accuracy_rate: body.accuracy_rate,
        activation_rate: body.activation_rate,
        pulse_rate: body.pulse_rate,
      });

      this.logger.log(
        `✅ Report generated - Status: ${report.goal_status}, Plan Type: ${report.adaptive_plan.type}`,
      );

      // Optionally persist report and progress if sessionId is provided
      if (body.sessionId) {
        try {
          const session = await this.sessionRepo.findOne({
            where: { id: body.sessionId },
          });

          if (session) {
            const reportEntity = this.reportRepo.create({
              session,
              summary: report.summary,
              recommendations:
                typeof report.recommendations === 'string'
                  ? report.recommendations
                  : null,
              rawReport: report,
            });
            await this.reportRepo.save(reportEntity);

            // Attach quick metrics snapshot to session
            session.notesSummary = report.summary;
            session.keyMetrics = {
              accuracy_rate: body.accuracy_rate,
              activation_rate: body.activation_rate,
              pulse_rate: body.pulse_rate,
              goal_status: report.goal_status,
            };
            session.endedAt = new Date();
            await this.sessionRepo.save(session);

            // Create a simple progress entry for the patient if known
            const userForProgress =
              (session.patient && session.patient.id
                ? session.patient
                : body.patientId
                ? await this.userRepo.findOne({
                    where: { id: body.patientId },
                  })
                : null) || null;

            if (userForProgress) {
              const progress = this.progressRepo.create({
                user: userForProgress,
                date: new Date().toISOString().slice(0, 10),
                accuracyRate: body.accuracy_rate,
                activationRate: body.activation_rate,
                pulseRate: body.pulse_rate,
                goalSnapshot: body.goal,
              });
              await this.progressRepo.save(progress);
            }
          }
        } catch (persistError) {
          this.logger.warn(
            `⚠️ Failed to persist session report/progress: ${
              (persistError as Error).message || String(persistError)
            }`,
          );
        }
      }

      return report;
    } catch (error) {
      const errorMessage = error?.message || 'Unknown error occurred';
      const errorDetails = error?.stack || error?.toString() || 'No additional details';
      
      this.logger.error('❌ Error generating report:', errorMessage);
      this.logger.error('Error details:', errorDetails);
      
      throw new HttpException(
        {
          success: false,
          message: 'Failed to generate session report',
          error: errorMessage,
          details: process.env.NODE_ENV === 'development' ? errorDetails : undefined,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private validateInput(body: SessionRequest): void {
    if (!body.height || body.height <= 0) {
      throw new BadRequestException('height must be a positive number');
    }

    if (!body.weight || body.weight <= 0) {
      throw new BadRequestException('weight must be a positive number');
    }

    if (!body.bmi || body.bmi <= 0) {
      throw new BadRequestException('bmi must be a positive number');
    }

    if (!['beginner', 'intermediate', 'advanced'].includes(body.fitness_experience)) {
      throw new BadRequestException(
        'fitness_experience must be one of: beginner, intermediate, advanced',
      );
    }

    if (!body.therapy_cause || typeof body.therapy_cause !== 'string' || body.therapy_cause.trim().length === 0) {
      throw new BadRequestException('therapy_cause must be a non-empty string');
    }

    if (!body.goal || typeof body.goal !== 'string' || body.goal.trim().length === 0) {
      throw new BadRequestException('goal must be a non-empty string');
    }

    if (
      typeof body.accuracy_rate !== 'number' ||
      body.accuracy_rate < 0 ||
      body.accuracy_rate > 100
    ) {
      throw new BadRequestException('accuracy_rate must be a number between 0 and 100');
    }

    if (
      typeof body.activation_rate !== 'number' ||
      body.activation_rate < 0 ||
      body.activation_rate > 100
    ) {
      throw new BadRequestException('activation_rate must be a number between 0 and 100');
    }

    if (
      typeof body.pulse_rate !== 'number' ||
      body.pulse_rate < 30 ||
      body.pulse_rate > 220
    ) {
      throw new BadRequestException('pulse_rate must be a number between 30 and 220');
    }
  }
}

