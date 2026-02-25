import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Session } from './session.entity';
import { ProgressEntry } from './progress-entry.entity';

export type UserRole = 'doctor' | 'fitness';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ nullable: true })
  email: string | null;

  @Column({ type: 'varchar' })
  role: UserRole;

  @Column({ nullable: true })
  passwordHash: string | null;

  @Column({ nullable: true })
  name: string | null;

  @Column({ type: 'int', nullable: true })
  age: number | null;

  @Column({ type: 'float', nullable: true })
  heightCm: number | null;

  @Column({ type: 'float', nullable: true })
  weightKg: number | null;

  @Column({ type: 'float', nullable: true })
  bmi: number | null;

  @Column({ type: 'text', nullable: true })
  goals: string | null;

  @Column({ type: 'text', nullable: true })
  cause: string | null;

  @OneToMany(() => Session, (session) => session.doctor)
  doctorSessions: Session[];

  @OneToMany(() => Session, (session) => session.patient)
  patientSessions: Session[];

  @OneToMany(() => ProgressEntry, (progress) => progress.user)
  progressEntries: ProgressEntry[];
}

