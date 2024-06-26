import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [UserModule, JwtModule.register({ secret: 'abc', global: true })],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
