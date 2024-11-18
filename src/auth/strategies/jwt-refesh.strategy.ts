// src/auth/strategies/jwt-refresh.strategy.ts
import { Injectable, UnauthorizedException, ForbiddenException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AppConfigService } from '../../app-config/app-config.service';
import { UserService } from '../../user/user.service';
import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    private readonly logger = new Logger(JwtRefreshStrategy.name);

    constructor(
        private readonly appConfigService: AppConfigService,
        private readonly userService: UserService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
            ignoreExpiration: false,
            secretOrKey: appConfigService.jwtRefreshSecretKey,
        });
    }

    async validate(payload: any) {
        this.logger.log(`Validating refresh token for user with ID: ${payload.sub}`);

        const user = await this.userService.findById(payload.sub);
        if (!user) {
            this.logger.warn(`User with ID ${payload.sub} not found during refresh token validation`);
            throw new UnauthorizedException('User not found');
        }

        // to do additional checks (e.g., isBlocked), implement them here

        this.logger.log(`Refresh token validated successfully for user with ID: ${payload.sub}`);
        return user;
    }
}
