import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AppConfigModule } from 'src/app-config/app-config.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AppConfigService } from 'src/app-config/app-config.service';
import { UserModule } from 'src/user/user.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refesh.strategy';
import { LocalStrategy } from './strategies/local.strategy';
@Module({
  imports: [
    AppConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: async (configService: AppConfigService) => ({
        secret: configService.jwtSecretAccessKey,
        signOptions: { expiresIn: configService.expiresInAccessKey },
      }),
    }),
    UserModule],
  providers: [AuthService, JwtStrategy, LocalStrategy, JwtRefreshStrategy],
  controllers: [AuthController]
})
export class AuthModule { }
