import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WsGateway } from './ws.gateway';
import { IoTController } from './iot.controller';
import { CVController } from './cv.controller';
import { SessionController } from './session.controller';
import { GeminiService } from './gemini.service';
import { User } from './entities/user.entity';
import { Session } from './entities/session.entity';
import { Report } from './entities/report.entity';
import { ProgressEntry } from './entities/progress-entry.entity';
import { Workout } from './entities/workout.entity';
import { AuthController } from './auth.controller';
import { WorkoutController } from './workout.controller';

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
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT || 5432),
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'dwarageshdc',
        database: process.env.DB_NAME || 'fitmon',
        entities: [User, Session, Report, ProgressEntry, Workout],
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([User, Session, Report, ProgressEntry, Workout]),
  ],
  controllers: [
    IoTController,
    CVController,
    SessionController,
    AuthController,
    WorkoutController,
  ],
  providers: [WsGateway, GeminiService],
})
export class AppModule {}

