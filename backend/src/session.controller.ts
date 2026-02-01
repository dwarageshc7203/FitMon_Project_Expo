import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { GeminiService, SessionReport } from './gemini.service';

interface SessionRequest {
  height: number;
  weight: number;
  bmi: number;
  fitness_experience: 'beginner' | 'intermediate' | 'advanced';
  therapy_cause: string;
  goal: string;
  accuracy_rate: number;
  activation_rate: number;
}

/**
 * Session Controller - Generates AI-powered physiotherapy session reports
 * Accepts patient details + IoT session metrics and returns structured report + adaptive plan
 */
@Controller('session')
export class SessionController {
  private readonly logger = new Logger(SessionController.name);

  constructor(private readonly geminiService: GeminiService) {}

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
      });

      this.logger.log(
        `✅ Report generated - Status: ${report.goal_status}, Plan Type: ${report.adaptive_plan.type}`,
      );

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
  }
}

