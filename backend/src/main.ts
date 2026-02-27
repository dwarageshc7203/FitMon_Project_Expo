import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import Bonjour from 'bonjour-service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Enable CORS for frontend
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Serve static files from public directory
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    index: 'index.html',
    prefix: '/',
  });

  const port = process.env.PORT || 3000;
  // Listen on all network interfaces (0.0.0.0) to allow ESP32 connections
  await app.listen(port, '0.0.0.0');
  
  // Advertise mDNS service for ESP32 discovery
  const bonjour = new Bonjour();
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

