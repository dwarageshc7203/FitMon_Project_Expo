import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('progress_entries')
export class ProgressEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.progressEntries, { eager: true })
  user: User;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'float', nullable: true })
  accuracyRate: number | null;

  @Column({ type: 'float', nullable: true })
  activationRate: number | null;

  @Column({ type: 'float', nullable: true })
  pulseRate: number | null;

  @Column({ type: 'text', nullable: true })
  goalSnapshot: string | null;

  @CreateDateColumn()
  createdAt: Date;
}

