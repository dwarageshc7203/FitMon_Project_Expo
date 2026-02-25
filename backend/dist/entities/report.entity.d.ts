import { Session } from './session.entity';
export declare class Report {
    id: string;
    session: Session;
    summary: string;
    recommendations: string | null;
    rawReport: any;
    createdAt: Date;
}
