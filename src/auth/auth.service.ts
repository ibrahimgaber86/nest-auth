import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { compare } from 'bcrypt';
import { LoginDto } from './login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwt: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto);

    return {
      accessToken: await this.jwt.signAsync(
        { sub: user.id, name: user.name },
        { expiresIn: '20s', secret: process.env.JWT_SECRET },
      ),
      refreshToken: await this.jwt.signAsync(
        { sub: user.id, name: user.name },
        { expiresIn: '7d', secret: process.env.JWT_RFfRESH_SECRET },
      ),
    };
  }

  async refresh(id: string) {
    const user = await this.userService.findById(id);

    if (!user) throw new UnauthorizedException();

    return {
      accessToken: await this.jwt.signAsync(
        { sub: user.id, name: user.name },
        { expiresIn: '20s', secret: process.env.JWT_SECRET },
      ),
      refreshToken: await this.jwt.signAsync(
        { sub: user.id, name: user.name },
        { expiresIn: '7d', secret: process.env.JWT_RFfRESH_SECRET },
      ),
    };
  }
  async validateUser({ email, password }: LoginDto) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('invalid email or password');
    }

    return user.password && (await compare(password, user.password))
      ? user
      : undefined;
  }
}
