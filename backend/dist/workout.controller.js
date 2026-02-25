"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkoutController = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const workout_entity_1 = require("./entities/workout.entity");
let WorkoutController = class WorkoutController {
    constructor(workoutRepo) {
        this.workoutRepo = workoutRepo;
    }
    async listWorkouts(userId) {
        if (!userId) {
            const workouts = await this.workoutRepo.find();
            return { workouts };
        }
        const progressRepo = this.workoutRepo.manager.getRepository('progress_entries');
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
        let targetLevel;
        if (avgScore >= 75)
            targetLevel = 'advanced';
        else if (avgScore >= 50)
            targetLevel = 'intermediate';
        else
            targetLevel = 'beginner';
        const candidates = await this.workoutRepo.find({
            where: targetLevel ? { level: targetLevel } : {},
        });
        const workouts = candidates.length > 0 ? candidates : await this.workoutRepo.find();
        return { workouts, level: targetLevel, latestProgress: latest };
    }
};
exports.WorkoutController = WorkoutController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WorkoutController.prototype, "listWorkouts", null);
exports.WorkoutController = WorkoutController = __decorate([
    (0, common_1.Controller)('workouts'),
    __param(0, (0, typeorm_1.InjectRepository)(workout_entity_1.Workout)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], WorkoutController);
//# sourceMappingURL=workout.controller.js.map