import { User } from './user.entity';
export declare class ProgressEntry {
    id: string;
    user: User;
    date: string;
    accuracyRate: number | null;
    activationRate: number | null;
    pulseRate: number | null;
    goalSnapshot: string | null;
    createdAt: Date;
}
