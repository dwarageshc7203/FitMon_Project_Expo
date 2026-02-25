import { Session } from './session.entity';
import { ProgressEntry } from './progress-entry.entity';
export type UserRole = 'doctor' | 'fitness';
export declare class User {
    id: string;
    username: string;
    email: string | null;
    role: UserRole;
    passwordHash: string | null;
    name: string | null;
    age: number | null;
    heightCm: number | null;
    weightKg: number | null;
    bmi: number | null;
    goals: string | null;
    cause: string | null;
    doctorSessions: Session[];
    patientSessions: Session[];
    progressEntries: ProgressEntry[];
}
