import { Repository } from 'typeorm';
import { Workout } from './entities/workout.entity';
export declare class WorkoutController {
    private readonly workoutRepo;
    constructor(workoutRepo: Repository<Workout>);
    listWorkouts(userId?: string): Promise<{
        workouts: Workout[];
        level?: undefined;
        latestProgress?: undefined;
    } | {
        workouts: Workout[];
        level: string;
        latestProgress: any;
    }>;
}
