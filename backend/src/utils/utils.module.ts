import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthUtils } from './auth.utils';

@Module({
  imports: [ConfigModule],
  providers: [AuthUtils],
  exports: [AuthUtils],
})
export class UtilsModule {}
