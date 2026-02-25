import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Session } from './session.entity';

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Session, (session) => session.reports, { eager: true })
  session: Session;

  @Column({ type: 'text' })
  summary: string;

  @Column({ type: 'text', nullable: true })
  recommendations: string | null;

  @Column({ type: 'jsonb', nullable: true })
  rawReport: any;

  @CreateDateColumn()
  createdAt: Date;
}

