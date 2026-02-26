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
export declare class SessionController {
    private readonly geminiService;
    private readonly sessionRepo;
    private readonly userRepo;
    private readonly reportRepo;
    private readonly progressRepo;
    private readonly logger;
    constructor(geminiService: GeminiService, sessionRepo: Repository<Session>, userRepo: Repository<User>, reportRepo: Repository<Report>, progressRepo: Repository<ProgressEntry>);
    createMeeting(body: {
        doctorId?: string;
    }): Promise<{
        success: boolean;
        code?: string;
        sessionId?: string;
        message?: string;
    }>;
    joinMeeting(body: {
        patientId?: string;
        code?: string;
    }): Promise<{
        success: boolean;
        sessionId?: string;
        code?: string;
        message?: string;
    }>;
    generateReport(body: SessionRequest): Promise<SessionReport>;
    private validateInput;
    getHistory(userId: string): Promise<{
        success: boolean;
        sessions: Session[];
    }>;
}
export {};
