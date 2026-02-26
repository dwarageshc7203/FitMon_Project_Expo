import { Repository } from 'typeorm';
import { Workout } from './entities/workout.entity';
import { ProgressEntry } from './entities/progress-entry.entity';
import { User } from './entities/user.entity';
export declare class WorkoutController {
    private readonly workoutRepo;
    private readonly progressRepo;
    private readonly userRepo;
    constructor(workoutRepo: Repository<Workout>, progressRepo: Repository<ProgressEntry>, userRepo: Repository<User>);
    listWorkouts(userId?: string, goalsParam?: string): Promise<{
        workouts: any[];
        message: string;
        level?: undefined;
        goals?: undefined;
    } | {
        workouts: {
            score: number;
            title: string;
            youtubeId: string;
            level: string;
            duration: string;
            description: string;
            tags: string[];
        }[];
        level: string;
        goals: string[];
        message?: undefined;
    }>;
}
