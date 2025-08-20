import { Controller, Get, Logger, Query, Req, Res } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { AuthGoogleService } from './auth.google.service';
import { SignUpType } from './models/auth.model';
import { Status } from 'src/user/entity/user.entity';

@Controller('auth/google')
export class AuthGoogleController {
  private readonly logger = new Logger(AuthGoogleController.name);
  constructor(
    private readonly authGoogleService: AuthGoogleService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Get('signin') // 구글 로그인 페이지 이동
  signinGoogle(@Req() req: Request, @Res() res: Response) {
    try {
      const url = this.authGoogleService.getGoogleAuthUrl();
      return res.send({
        success: true,
        message: '구글 로그인 페이지 이동',
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

  @Get('callback') // 구글 로그인 콜백
  async callbackGoogle(@Query('code') code: string, @Res() res: Response) {
    try {
      // 구글 로그인 인증 토큰 발급
      const tokens = await this.authGoogleService.getGoogleAuthToken(code);

      // 구글 로그인 유저 정보 조회
      const userData = await this.authGoogleService.getGoogleUser(
        tokens.access_token as string,
      );

      // 가입된 이메일 있는지 확인
      let user = await this.userService.findOne(userData.email as string);
      if (!user) {
        // 소셜 로그인 회원 가입
        await this.userService.addSocialUser({
          email: userData.email as string,
          name: userData.name as string,
          type: SignUpType.GOOGLE,
          profileImage: userData.picture as string,
        });
        user = await this.userService.findOne(userData.email as string);
      }
      if (user!.status === Status.INACTIVE) {
        return res.status(400).send('회원 탈퇴 처리된 계정입니다.');
      }
      // 마지막 로그인 시간 업데이트
      await this.userService.updateLastLogin(user!.email);

      // 토큰 생성
      const tokenInfo = this.authService.makeTokens(user!, {
        access_token: tokens.access_token as string,
        refresh_token: tokens.refresh_token as string,
        token_type: tokens.token_type as string,
        expiry_date: tokens.expiry_date as number,
      });

      return res.status(200).send(tokenInfo);
    } catch (e) {
      this.logger.error(e);
      return res.status(500).send(e.message);
    }
  }
}
