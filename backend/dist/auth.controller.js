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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
let AuthController = class AuthController {
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    async signup(body) {
        const existing = await this.userRepo.findOne({
            where: { username: body.username },
        });
        if (existing) {
            return {
                success: false,
                message: 'Username already exists',
            };
        }
        const user = this.userRepo.create({
            username: body.username,
            role: body.role,
            passwordHash: body.password,
        });
        const saved = await this.userRepo.save(user);
        return {
            success: true,
            user: {
                id: saved.id,
                username: saved.username,
                role: saved.role,
            },
        };
    }
    async login(body) {
        const user = await this.userRepo.findOne({
            where: { username: body.username },
        });
        if (!user || user.passwordHash !== body.password) {
            throw new common_1.NotFoundException('Invalid username or password');
        }
        return {
            success: true,
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
            },
        };
    }
    async getProfile(id) {
        const user = await this.userRepo.findOne({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const { passwordHash: _, ...safe } = user;
        return { success: true, user: safe };
    }
    async updateProfile(id, body) {
        const user = await this.userRepo.findOne({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const allowed = ['name', 'age', 'email', 'heightCm', 'weightKg', 'bmi', 'goals', 'cause'];
        for (const key of allowed) {
            if (body[key] !== undefined) {
                user[key] = body[key];
            }
        }
        const saved = await this.userRepo.save(user);
        const { passwordHash: _, ...safe } = saved;
        return { success: true, user: safe };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('signup'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signup", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('profile/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Put)('profile/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateProfile", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AuthController);
//# sourceMappingURL=auth.controller.js.map