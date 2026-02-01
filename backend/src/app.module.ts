import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { WsGateway } from './ws.gateway';
import { IoTController } from './iot.controller';
import { CVController } from './cv.controller';
import { SessionController } from './session.controller';
import { GeminiService } from './gemini.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make ConfigModule available globally
      // Load .env file - try multiple paths for dev and production
      envFilePath: [
        join(__dirname, '..', '.env'), // For dev mode (src) or production (dist/src -> dist -> backend)
        join(__dirname, '..', '..', '.env'), // Alternative path
        '.env', // Fallback to current working directory
      ],
    }),
  ],
  controllers: [IoTController, CVController, SessionController],
  providers: [WsGateway, GeminiService],
})
export class AppModule {}

