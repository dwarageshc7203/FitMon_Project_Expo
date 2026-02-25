import { User } from './user.entity';
import { Report } from './report.entity';
export declare class Session {
    id: string;
    code: string;
    doctor: User;
    patient: User | null;
    startedAt: Date | null;
    endedAt: Date | null;
    notesSummary: string | null;
    keyMetrics: Record<string, any> | null;
    createdAt: Date;
    updatedAt: Date;
    reports: Report[];
}
