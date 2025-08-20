import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthGoogleService } from './auth.google.service';
import { AuthKakaoService } from './auth.kakao.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from 'src/config/config.module';
import { UtilsModule } from 'src/utils/utils.module';
import { AuthGoogleController } from './auth.google.controller';
import { AuthKakaoController } from './auth.kakao.controller';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET, // 환경 변수에 설정된 JWT 비밀 키 사용
      signOptions: { expiresIn: '1h' }, // 토큰 만료 시간 설정
    }),
    HttpModule,
    ConfigModule,
    UtilsModule,
  ],
  providers: [AuthService, AuthGoogleService, AuthKakaoService],
  controllers: [AuthController, AuthGoogleController, AuthKakaoController],
  exports: [AuthService],
})
export class AuthModule {}
