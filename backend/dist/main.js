"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const path_1 = require("path");
const bonjour_service_1 = __importDefault(require("bonjour-service"));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'public'), {
        index: 'index.html',
        prefix: '/',
    });
    const port = process.env.PORT || 3000;
    await app.listen(port, '0.0.0.0');
    const bonjour = new bonjour_service_1.default();
    bonjour.publish({
        name: 'FitMon Backend',
        type: 'http',
        port: Number(port),
        host: 'fitmon.local',
    });
    console.log(`🚀 FitMon backend running on http://localhost:${port}`);
    console.log(`📡 mDNS service published as: fitmon.local:${port}`);
    console.log(`📱 Patient page: http://localhost:${port}/patient.html`);
    console.log(`👨‍⚕️ Doctor dashboard: http://localhost:${port}/doctor.html`);
    console.log(`🌐 Access from network: http://YOUR_IP:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map