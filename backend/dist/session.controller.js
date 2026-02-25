"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var SessionController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionController = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const gemini_service_1 = require("./gemini.service");
const session_entity_1 = require("./entities/session.entity");
const user_entity_1 = require("./entities/user.entity");
const report_entity_1 = require("./entities/report.entity");
const progress_entry_entity_1 = require("./entities/progress-entry.entity");
let SessionController = SessionController_1 = class SessionController {
    constructor(geminiService, sessionRepo, userRepo, reportRepo, progressRepo) {
        this.geminiService = geminiService;
        this.sessionRepo = sessionRepo;
        this.userRepo = userRepo;
        this.reportRepo = reportRepo;
        this.progressRepo = progressRepo;
        this.logger = new common_1.Logger(SessionController_1.name);
    }
    async createMeeting(body) {
        if (!body.doctorId) {
            throw new common_1.BadRequestException('doctorId is required');
        }
        const doctor = await this.userRepo.findOne({
            where: { id: body.doctorId, role: 'doctor' },
        });
        if (!doctor) {
            throw new common_1.BadRequestException('Doctor not found');
        }
        let code;
        while (true) {
            code = Math.random().toString(36).slice(2, 8).toUpperCase();
            const existing = await this.sessionRepo.findOne({ where: { code } });
            if (!existing)
                break;
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
    async joinMeeting(body) {
        const rawCode = (body.code || '').trim().toUpperCase();
        if (!rawCode) {
            throw new common_1.BadRequestException('code is required');
        }
        const session = await this.sessionRepo.findOne({ where: { code: rawCode } });
        if (!session) {
            throw new common_1.BadRequestException('Invalid or expired session code');
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
    async generateReport(body) {
        this.validateInput(body);
        this.logger.log(`📊 Generating session report for patient: ${body.fitness_experience} fitness, goal: "${body.goal}"`);
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
            this.logger.log(`✅ Report generated - Status: ${report.goal_status}, Plan Type: ${report.adaptive_plan.type}`);
            if (body.sessionId) {
                try {
                    const session = await this.sessionRepo.findOne({
                        where: { id: body.sessionId },
                    });
                    if (session) {
                        const reportEntity = this.reportRepo.create({
                            session,
                            summary: report.summary,
                            recommendations: typeof report.recommendations === 'string'
                                ? report.recommendations
                                : null,
                            rawReport: report,
                        });
                        await this.reportRepo.save(reportEntity);
                        session.notesSummary = report.summary;
                        session.keyMetrics = {
                            accuracy_rate: body.accuracy_rate,
                            activation_rate: body.activation_rate,
                            pulse_rate: body.pulse_rate,
                            goal_status: report.goal_status,
                        };
                        session.endedAt = new Date();
                        await this.sessionRepo.save(session);
                        const userForProgress = (session.patient && session.patient.id
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
                }
                catch (persistError) {
                    this.logger.warn(`⚠️ Failed to persist session report/progress: ${persistError.message || String(persistError)}`);
                }
            }
            return report;
        }
        catch (error) {
            const errorMessage = error?.message || 'Unknown error occurred';
            const errorDetails = error?.stack || error?.toString() || 'No additional details';
            this.logger.error('❌ Error generating report:', errorMessage);
            this.logger.error('Error details:', errorDetails);
            throw new common_1.HttpException({
                success: false,
                message: 'Failed to generate session report',
                error: errorMessage,
                details: process.env.NODE_ENV === 'development' ? errorDetails : undefined,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    validateInput(body) {
        if (!body.height || body.height <= 0) {
            throw new common_1.BadRequestException('height must be a positive number');
        }
        if (!body.weight || body.weight <= 0) {
            throw new common_1.BadRequestException('weight must be a positive number');
        }
        if (!body.bmi || body.bmi <= 0) {
            throw new common_1.BadRequestException('bmi must be a positive number');
        }
        if (!['beginner', 'intermediate', 'advanced'].includes(body.fitness_experience)) {
            throw new common_1.BadRequestException('fitness_experience must be one of: beginner, intermediate, advanced');
        }
        if (!body.therapy_cause || typeof body.therapy_cause !== 'string' || body.therapy_cause.trim().length === 0) {
            throw new common_1.BadRequestException('therapy_cause must be a non-empty string');
        }
        if (!body.goal || typeof body.goal !== 'string' || body.goal.trim().length === 0) {
            throw new common_1.BadRequestException('goal must be a non-empty string');
        }
        if (typeof body.accuracy_rate !== 'number' ||
            body.accuracy_rate < 0 ||
            body.accuracy_rate > 100) {
            throw new common_1.BadRequestException('accuracy_rate must be a number between 0 and 100');
        }
        if (typeof body.activation_rate !== 'number' ||
            body.activation_rate < 0 ||
            body.activation_rate > 100) {
            throw new common_1.BadRequestException('activation_rate must be a number between 0 and 100');
        }
        if (typeof body.pulse_rate !== 'number' ||
            body.pulse_rate < 30 ||
            body.pulse_rate > 220) {
            throw new common_1.BadRequestException('pulse_rate must be a number between 30 and 220');
        }
    }
};
exports.SessionController = SessionController;
__decorate([
    (0, common_1.Post)('create-meeting'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "createMeeting", null);
__decorate([
    (0, common_1.Post)('join-meeting'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "joinMeeting", null);
__decorate([
    (0, common_1.Post)('generate-report'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "generateReport", null);
exports.SessionController = SessionController = SessionController_1 = __decorate([
    (0, common_1.Controller)('session'),
    __param(1, (0, typeorm_1.InjectRepository)(session_entity_1.Session)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(3, (0, typeorm_1.InjectRepository)(report_entity_1.Report)),
    __param(4, (0, typeorm_1.InjectRepository)(progress_entry_entity_1.ProgressEntry)),
    __metadata("design:paramtypes", [gemini_service_1.GeminiService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SessionController);
//# sourceMappingURL=session.controller.js.map