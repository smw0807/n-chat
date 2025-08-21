import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const token = request.headers.authorization;

      if (!token) {
        throw new UnauthorizedException('토큰이 없습니다.');
      }
      const tokenValue = token.split(' ')[1];
      const decoded = await this.authService.verifyToken(tokenValue);
      if (!decoded) {
        throw new UnauthorizedException('유효하지 않은 토큰입니다.');
      }
      request.user = decoded;
      return true;
    } catch (e) {
      this.logger.error(e);
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }
  }
}
