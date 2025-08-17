import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerService } from './logger/logger.service';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useLogger(LoggerService);

  app.setGlobalPrefix('api');

  const configService = app.get(ConfigService);

  const corsConfig = configService.get('cors') as {
    origin: string;
    methods: string;
    allowedHeaders: string;
  };

  app.enableCors({
    origin: corsConfig.origin,
    methods: corsConfig.methods,
    allowedHeaders: corsConfig.allowedHeaders,
  });

  const appConfig = configService.get('app');

  LoggerService.log(`[ Server is running on port ${appConfig.appPort} ]`);
  await app.listen(appConfig.appPort ?? 3000);
}
bootstrap();
