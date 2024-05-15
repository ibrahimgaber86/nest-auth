import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const token = this.extractToken(req);
    if (!token) throw new UnauthorizedException();

    try {
      const payload = await this.jwt.verifyAsync(token, {
        secret: process.env.JWT_REFRESH_TOKEN,
      });
      req.user = payload;
    } catch (error) {
      throw new UnauthorizedException();
    }
    return true;
  }

  extractToken(req: Request) {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    return type == 'refresh' ? token : undefined;
  }
}
