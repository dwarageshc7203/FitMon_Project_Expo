"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const path_1 = require("path");
const typeorm_1 = require("@nestjs/typeorm");
const ws_gateway_1 = require("./ws.gateway");
const iot_controller_1 = require("./iot.controller");
const cv_controller_1 = require("./cv.controller");
const session_controller_1 = require("./session.controller");
const gemini_service_1 = require("./gemini.service");
const user_entity_1 = require("./entities/user.entity");
const session_entity_1 = require("./entities/session.entity");
const report_entity_1 = require("./entities/report.entity");
const progress_entry_entity_1 = require("./entities/progress-entry.entity");
const workout_entity_1 = require("./entities/workout.entity");
const auth_controller_1 = require("./auth.controller");
const workout_controller_1 = require("./workout.controller");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: [
                    (0, path_1.join)(__dirname, '..', '.env'),
                    (0, path_1.join)(__dirname, '..', '..', '.env'),
                    '.env',
                ],
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                useFactory: () => ({
                    type: 'postgres',
                    host: process.env.DB_HOST || 'localhost',
                    port: Number(process.env.DB_PORT || 5432),
                    username: process.env.DB_USER || 'postgres',
                    password: process.env.DB_PASSWORD || 'dwarageshdc',
                    database: process.env.DB_NAME || 'fitmon',
                    entities: [user_entity_1.User, session_entity_1.Session, report_entity_1.Report, progress_entry_entity_1.ProgressEntry, workout_entity_1.Workout],
                    synchronize: true,
                }),
            }),
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, session_entity_1.Session, report_entity_1.Report, progress_entry_entity_1.ProgressEntry, workout_entity_1.Workout]),
        ],
        controllers: [
            iot_controller_1.IoTController,
            cv_controller_1.CVController,
            session_controller_1.SessionController,
            auth_controller_1.AuthController,
            workout_controller_1.WorkoutController,
        ],
        providers: [ws_gateway_1.WsGateway, gemini_service_1.GeminiService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map