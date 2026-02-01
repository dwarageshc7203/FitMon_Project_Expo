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
export declare class SessionController {
    private readonly geminiService;
    private readonly logger;
    constructor(geminiService: GeminiService);
    generateReport(body: SessionRequest): Promise<SessionReport>;
    private validateInput;
}
export {};
