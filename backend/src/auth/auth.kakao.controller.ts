import { Controller, Get, Logger, Query, Req, Res } from '@nestjs/common';
import { AuthKakaoService } from './auth.kakao.service';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { AuthUtils } from 'src/utils/auth.utils';
import { SignUpType } from './models/auth.model';

@Controller('auth/kakao')
export class AuthKakaoController {
  private readonly logger = new Logger(AuthKakaoController.name);
  constructor(
    private readonly authKakaoService: AuthKakaoService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly authUtils: AuthUtils,
  ) {}

  @Get('signin') // 카카오 로그인 페이지 이동
  signinKakao(@Req() req: Request, @Res() res: Response) {
    try {
      const url = this.authKakaoService.getKakaoAuthUrl();
      return res.status(200).send({
        success: true,
        message: '카카오 로그인 페이지 이동',
        url: url,
      });
    } catch (e) {
      this.logger.error(e);
      return res.status(500).send({
        success: false,
        message: e.message,
      });
    }
  }

  @Get('callback') // 카카오 로그인 콜백
  async callbackKakao(@Query('code') code: string, @Res() res: Response) {
    try {
      // 카카오 로그인 인증 토큰 발급
      const tokens = await this.authKakaoService.getKakaoAuthToken(code);
      // 카카오 로그인 유저 정보 조회
      const userData = await this.authKakaoService.getKakaoUser(
        tokens.access_token,
        tokens.token_type,
      );
      // 가입된 이메일 있는지 확인
      let user = await this.userService.findOne(userData.kakao_account.email);
      if (!user) {
        // 소셜 로그인 회원 가입
        await this.userService.addSocialUser({
          email: userData.kakao_account.email,
          name: userData.properties.nickname,
          type: SignUpType.KAKAO,
          profileImage: userData.properties.profile_image,
        });
        user = await this.userService.findOne(userData.kakao_account.email);
      }

      // 마지막 로그인 시간 업데이트
      await this.userService.updateLastLogin(user!.email);
      // 토큰 생성
      const tokenInfo = this.authService.makeTokens(user!, tokens);

      return res.status(200).send(tokenInfo);
    } catch (e) {
      this.logger.error(e);
      return res.status(500).send(e.message);
    }
  }
}
