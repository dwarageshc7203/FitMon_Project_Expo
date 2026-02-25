import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Report } from './report.entity';

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @ManyToOne(() => User, (user) => user.doctorSessions, { eager: true })
  doctor: User;

  @ManyToOne(() => User, (user) => user.patientSessions, {
    eager: true,
    nullable: true,
  })
  patient: User | null;

  @Column({ type: 'timestamp', nullable: true })
  startedAt: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  endedAt: Date | null;

  @Column({ type: 'text', nullable: true })
  notesSummary: string | null;

  @Column({ type: 'jsonb', nullable: true })
  keyMetrics: Record<string, any> | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Report, (report) => report.session)
  reports: Report[];
}

