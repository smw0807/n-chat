import { Controller, Headers, Logger, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { UserService } from 'src/user/user.service';
import { Status } from 'src/user/entity/user.entity';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  // 이메일 로그인
  @Post('login')
  async signinEmail(
    @Headers('authorization') authorization: string,
    @Res() res: Response,
  ) {
    try {
      const token = authorization.split(' ');
      if (token.length !== 2) {
        return res.status(401).send('유효하지 않은 토큰입니다.');
      }
      const tokenValue = token[1];
      const decoded = Buffer.from(tokenValue, 'base64').toString('utf-8');
      const [email, password] = decoded.split(':');

      this.logger.log(`이메일 로그인 요청: ${email}`);
      if (!email || !password) {
        return res.status(400).send('이메일 또는 비밀번호가 없습니다.');
      }
      // 회원 정보 확인
      const user = await this.userService.findOne(email);
      if (!user) {
        return res.status(404).send('존재하지 않는 이메일입니다.');
      }
      if (user.status === Status.INACTIVE) {
        return res.status(400).send('회원 탈퇴 처리된 계정입니다.');
      }
      if (user.password === null) {
        return res.status(400).send('소셜 로그인 계정입니다.');
      }

      // 비밀번호 확인
      const isPasswordValid = await this.userService.verifyPassword(
        email,
        password,
      );
      if (!isPasswordValid) {
        return res.status(401).send('비밀번호가 일치하지 않습니다.');
      }

      // 마지막 로그인 시간 업데이트
      await this.userService.updateLastLogin(email);

      // 토큰 발급
      const tokenInfo = this.authService.makeTokens(user);
      return res.status(200).send({
        success: true,
        message: '이메일 로그인 성공',
        token: tokenInfo,
      });
    } catch (e) {
      this.logger.error(e);
      return res.status(500).send({
        success: false,
        message: e.message,
      });
    }
  }

  // 토큰 검증 (토큰 헤더에 담겨있어야함)
  @Post('verify/token')
  async verifyToken(
    @Headers('authorization') authorization: string,
    @Res() res: Response,
  ) {
    try {
      const token = authorization.split(' ');
      if (token.length !== 2) {
        return res.status(401).send('유효하지 않은 토큰입니다.');
      }
      // access token 검증
      const decoded = await this.authService.verifyToken(token[1]);
      if (!decoded) {
        return res.status(401).send('유효하지 않은 토큰입니다.');
      }
      return res.status(200).send({
        success: true,
        message: '토큰 검증 성공',
        data: decoded,
      });
    } catch (e) {
      this.logger.error(e);
      return res.status(500).send({
        success: false,
        message: e.message,
      });
    }
  }

  // 토큰 재발급(토큰 헤더에 담겨있어야함)
  @Post('refresh/token')
  async refreshToken(
    @Headers('authorization') authorization: string,
    @Res() res: Response,
  ) {
    try {
      const token = authorization.split(' ');
      if (token.length !== 2) {
        return res.status(401).send('유효하지 않은 토큰입니다.');
      }
      const decoded = await this.authService.verifyToken(token[1]);
      if (!decoded) {
        return res.status(401).send('유효하지 않은 토큰입니다.');
      }
      const user = await this.userService.findOne(decoded.email);
      if (!user) {
        return res.status(404).send('존재하지 않는 이메일입니다.');
      }
      const tokenInfo = this.authService.makeTokens(user);
      return res.status(200).send({
        success: true,
        message: '토큰 재발급 성공',
        token: tokenInfo,
      });
    } catch (e) {
      this.logger.error(e);
      return res.status(500).send({
        success: false,
        message: e.message,
      });
    }
  }
}
