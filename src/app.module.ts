import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { Cron, ScheduleModule, CronExpression } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    AuthModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  @Cron(CronExpression.EVERY_10_MINUTES)
  async test() {
    const res = await fetch('https://nest-auth-vglw.onrender.com');
    console.log({ res: await res.text() });
  }
}
