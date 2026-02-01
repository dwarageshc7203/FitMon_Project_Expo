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
const ws_gateway_1 = require("./ws.gateway");
const iot_controller_1 = require("./iot.controller");
const cv_controller_1 = require("./cv.controller");
const session_controller_1 = require("./session.controller");
const gemini_service_1 = require("./gemini.service");
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
        ],
        controllers: [iot_controller_1.IoTController, cv_controller_1.CVController, session_controller_1.SessionController],
        providers: [ws_gateway_1.WsGateway, gemini_service_1.GeminiService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map