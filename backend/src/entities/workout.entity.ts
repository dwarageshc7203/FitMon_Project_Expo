import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('workouts')
export class Workout {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  youtubeUrl: string;

  @Column({ nullable: true })
  level: string | null;

  @Column({ nullable: true })
  focusArea: string | null;

  @Column({ nullable: true })
  goalTag: string | null;
}

