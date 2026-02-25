import { Controller, Get, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workout } from './entities/workout.entity';

@Controller('workouts')
export class WorkoutController {
  constructor(
    @InjectRepository(Workout)
    private readonly workoutRepo: Repository<Workout>,
  ) {}

  @Get()
  async listWorkouts(@Query('userId') userId?: string) {
    // Basic personalization based on latest progress; falls back to all workouts.
    if (!userId) {
      const workouts = await this.workoutRepo.find();
      return { workouts };
    }

    // Simple heuristic: map progress to workout "level"
    // (advanced / intermediate / beginner).
    const progressRepo = (this.workoutRepo.manager.getRepository(
      'progress_entries',
    ) as unknown) as Repository<any>;

    const latest = await progressRepo.findOne({
      where: { user: { id: userId } },
      order: { date: 'DESC', createdAt: 'DESC' },
    });

    if (!latest) {
      const workouts = await this.workoutRepo.find();
      return { workouts };
    }

    const accuracy = latest.accuracyRate ?? 0;
    const activation = latest.activationRate ?? 0;
    const avgScore = (accuracy + activation) / 2;

    let targetLevel: string | null;
    if (avgScore >= 75) targetLevel = 'advanced';
    else if (avgScore >= 50) targetLevel = 'intermediate';
    else targetLevel = 'beginner';

    const candidates = await this.workoutRepo.find({
      where: targetLevel ? { level: targetLevel } : {},
    });

    // Fallback to all workouts if none match level.
    const workouts = candidates.length > 0 ? candidates : await this.workoutRepo.find();
    return { workouts, level: targetLevel, latestProgress: latest };
  }
}

