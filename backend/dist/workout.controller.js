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
const progress_entry_entity_1 = require("./entities/progress-entry.entity");
const user_entity_1 = require("./entities/user.entity");
const WORKOUT_LIBRARY = [
    { title: 'HIIT Fat Burn — 20 Min', youtubeId: 'M0uO8X3_tEA', level: 'intermediate', duration: '20 min', description: 'High-intensity intervals to torch calories and boost metabolism.', tags: ['weight loss', 'fat loss', 'cardio', 'hiit', 'endurance'] },
    { title: 'Full Body Strength Training', youtubeId: 'cbKkB3POqaY', level: 'intermediate', duration: '30 min', description: 'Compound movements for total-body muscle growth.', tags: ['strength', 'muscle', 'muscle building', 'weight training', 'toning'] },
    { title: 'Beginner Home Workout', youtubeId: 'IODxDxX7oi4', level: 'beginner', duration: '20 min', description: 'No-equipment full body routine for new fitness enthusiasts.', tags: ['beginner', 'general fitness', 'weight loss', 'toning'] },
    { title: 'Yoga for Flexibility', youtubeId: 'v7AYKMP6rOE', level: 'beginner', duration: '25 min', description: 'Improve mobility and reduce stiffness with this yoga flow.', tags: ['flexibility', 'yoga', 'mobility', 'stress relief', 'stretching'] },
    { title: 'Morning Yoga Stretch', youtubeId: 'sTANio_2E0Q', level: 'beginner', duration: '15 min', description: 'Gentle morning routine to wake the body and loosen joints.', tags: ['flexibility', 'yoga', 'stretching', 'mobility', 'stress relief'] },
    { title: 'Resistance Band Full Body', youtubeId: 'aclHkVaku9U', level: 'intermediate', duration: '30 min', description: 'Resistance band exercises for strength and rehab.', tags: ['rehabilitation', 'strength', 'muscle', 'recovery', 'physical therapy'] },
    { title: 'Mobility & Flow Workout', youtubeId: 'g_tea8ZNk5A', level: 'beginner', duration: '20 min', description: 'Improve joint range-of-motion and functional movement.', tags: ['mobility', 'flexibility', 'rehabilitation', 'recovery', 'stretching'] },
    { title: 'Low Impact Cardio Workout', youtubeId: 'bOtm12Lr3V8', level: 'beginner', duration: '25 min', description: 'Heart-rate boosting cardio that is gentle on the joints.', tags: ['weight loss', 'cardio', 'endurance', 'rehabilitation', 'recovery'] },
    { title: 'Core Strength Training', youtubeId: 'uX9YVgstBnA', level: 'intermediate', duration: '15 min', description: 'Targeted abs and core stability exercises.', tags: ['core', 'strength', 'toning', 'muscle', 'general fitness'] },
    { title: 'Pilates for Beginners', youtubeId: 'Fy6pVoMT9kI', level: 'beginner', duration: '30 min', description: 'Pilates fundamentals for core strength and posture.', tags: ['core', 'flexibility', 'posture', 'rehabilitation', 'toning'] },
    { title: 'Dumbbell Home Workout', youtubeId: '2xVNexAqCuI', level: 'intermediate', duration: '35 min', description: 'Build strength with just a pair of dumbbells at home.', tags: ['strength', 'muscle building', 'weight training', 'muscle', 'toning'] },
    { title: 'Back Pain Relief Exercises', youtubeId: 'qULTwquOuT4', level: 'beginner', duration: '15 min', description: 'Physical therapy movements to relieve and prevent back pain.', tags: ['rehabilitation', 'recovery', 'pain relief', 'physical therapy', 'back pain'] },
    { title: 'Knee Rehabilitation', youtubeId: 'FpKxJ-pQjzY', level: 'beginner', duration: '20 min', description: 'Post-surgery and injury recovery exercises for the knee.', tags: ['rehabilitation', 'knee', 'recovery', 'physical therapy', 'post-surgery'] },
    { title: 'Shoulder & Back Stretch', youtubeId: 'F1yxXQDhHcY', level: 'beginner', duration: '10 min', description: 'Relieve upper body tension and improve shoulder mobility.', tags: ['stretching', 'rehabilitation', 'flexibility', 'recovery', 'posture'] },
    { title: 'Advanced HIIT Challenge', youtubeId: 'ml6cT4AZdqI', level: 'advanced', duration: '40 min', description: 'Intense cardio and plyometric intervals for advanced athletes.', tags: ['hiit', 'endurance', 'cardio', 'weight loss', 'fat loss'] },
    { title: 'Flexibility Training', youtubeId: 'L_xrDAtykMI', level: 'intermediate', duration: '30 min', description: 'Deep stretching routine for full body flexibility gains.', tags: ['flexibility', 'stretching', 'mobility', 'yoga', 'recovery'] },
];
function extractGoalKeywords(goals) {
    const lower = goals.toLowerCase();
    const keywords = [];
    const patterns = {
        'weight loss': ['weight loss', 'lose weight', 'fat', 'slim', 'burn'],
        'muscle': ['muscle', 'bulk', 'strength', 'weight train', 'lift'],
        'strength': ['strong', 'strength', 'power', 'resistance'],
        'flexibility': ['flexible', 'flexibility', 'stretch', 'yoga', 'mobility'],
        'rehabilitation': ['rehab', 'recover', 'injury', 'therapy', 'post-op', 'surgery', 'knee', 'back pain', 'shoulder'],
        'cardio': ['cardio', 'stamina', 'endurance', 'run', 'aerobic'],
        'core': ['core', 'abs', 'abdom'],
        'toning': ['toned', 'tone', 'lean', 'definition'],
        'stress relief': ['stress', 'relax', 'mental', 'anxiety', 'calm', 'meditat'],
        'posture': ['posture', 'back', 'upper body'],
        'general fitness': ['fitness', 'healthy', 'active', 'overall'],
    };
    for (const [category, triggers] of Object.entries(patterns)) {
        if (triggers.some(t => lower.includes(t))) {
            keywords.push(category);
        }
    }
    return keywords.length > 0 ? keywords : ['general fitness'];
}
let WorkoutController = class WorkoutController {
    constructor(workoutRepo, progressRepo, userRepo) {
        this.workoutRepo = workoutRepo;
        this.progressRepo = progressRepo;
        this.userRepo = userRepo;
    }
    async listWorkouts(userId, goalsParam) {
        if (userId) {
            const user = await this.userRepo.findOne({ where: { id: userId } });
            if (user?.role === 'doctor') {
                return { workouts: [], message: 'Workouts are for fitness enthusiasts only.' };
            }
        }
        let targetLevel = null;
        if (userId) {
            const latest = await this.progressRepo.findOne({
                where: { user: { id: userId } },
                order: { date: 'DESC' },
            });
            if (latest) {
                const avg = ((latest.accuracyRate ?? 0) + (latest.activationRate ?? 0)) / 2;
                targetLevel = avg >= 75 ? 'advanced' : avg >= 50 ? 'intermediate' : 'beginner';
            }
        }
        let goalsText = goalsParam || '';
        if (!goalsText && userId) {
            const user = await this.userRepo.findOne({ where: { id: userId } });
            goalsText = user?.goals || '';
        }
        const keywords = goalsText ? extractGoalKeywords(goalsText) : [];
        const scored = WORKOUT_LIBRARY.map(w => {
            let score = 0;
            for (const kw of keywords) {
                if (w.tags.includes(kw))
                    score += 10;
            }
            if (targetLevel && w.level === targetLevel)
                score += 5;
            else if (!targetLevel)
                score += 3;
            return { ...w, score };
        });
        const sorted = scored.sort((a, b) => b.score - a.score).slice(0, 8);
        return {
            workouts: sorted,
            level: targetLevel,
            goals: keywords,
        };
    }
};
exports.WorkoutController = WorkoutController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Query)('goals')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], WorkoutController.prototype, "listWorkouts", null);
exports.WorkoutController = WorkoutController = __decorate([
    (0, common_1.Controller)('workouts'),
    __param(0, (0, typeorm_1.InjectRepository)(workout_entity_1.Workout)),
    __param(1, (0, typeorm_1.InjectRepository)(progress_entry_entity_1.ProgressEntry)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], WorkoutController);
//# sourceMappingURL=workout.controller.js.map