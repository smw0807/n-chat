import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import appConfig from './conf/app.config';
import authConfig from './conf/auth.config';

import { validationSchema } from './validation.schema';

@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env',
      load: [appConfig, authConfig],
      isGlobal: true,
      validationSchema: validationSchema,
    }),
  ],
})
export class ConfigModule {}
