import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import appConfig from './conf/app.config';
import authConfig from './conf/auth.config';
import corsConfig from './conf/cors.config';
import postgresConfig from './conf/postgres.config';
import googleConfig from './conf/google.config';
import kakaoConfig from './conf/kakao.config';

import { validationSchema } from './validation.schema';

@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env',
      load: [
        appConfig,
        authConfig,
        corsConfig,
        postgresConfig,
        googleConfig,
        kakaoConfig,
      ],
      isGlobal: true,
      validationSchema: validationSchema,
    }),
  ],
})
export class ConfigModule {}
