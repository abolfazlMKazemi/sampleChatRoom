import {
    Injectable,
    UnauthorizedException,
    InternalServerErrorException,
    Inject,
    Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Redis } from 'ioredis';

import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { AppConfigService } from '../app-config/app-config.service';
import { AuthResponseDto } from './dto/auth-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private appConfigService: AppConfigService,
        @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
    ) { }

    async validateUser(username: string, pass: string): Promise<any> {
        try {
            const user = await this.userService.findByUsername(username);
            if (user && (await bcrypt.compare(pass, user.password))) {
                const { password, ...result } = user;
                return result;
            }
            return null;
        } catch (error) {
            this.logger.error(`Error validating user: ${username}`, error.stack);
            throw new InternalServerErrorException('Error validating user');
        }
    }

    async generateAccessToken(user: User) {
        try {
            const payload = { username: user.username, sub: user.id };
            return this.jwtService.sign(payload, {
                secret: this.appConfigService.jwtSecretAccessKey,
                expiresIn: this.appConfigService.expiresInAccessKey,
            });
        } catch (error) {
            this.logger.error(`Error generating access token for user: ${user.id}`, error.stack);
            throw new InternalServerErrorException('Error generating access token');
        }
    }

    async generateRefreshToken(user: User) {
        try {
            const payload = { sub: user.id };
            const refreshToken = this.jwtService.sign(payload, {
                secret: this.appConfigService.jwtRefreshSecretKey,
                expiresIn: this.appConfigService.expiresInRefreshKey,
            });

            await this.saveRefreshToken(user.id, refreshToken);

            return refreshToken;
        } catch (error) {
            this.logger.error(`Error generating refresh token for user: ${user.id}`, error.stack);
            throw new InternalServerErrorException('Error generating refresh token');
        }
    }

    async saveRefreshToken(userId: string, refreshToken: string) {
        try {
            const expiresIn = this.appConfigService.expiresInRefreshKey;
            const expireInSeconds = this.getSecondsFromExpireTime(expiresIn);

            await this.redisClient.set(
                `refresh_token:${userId}`,
                refreshToken,
                'EX',
                expireInSeconds,
            );
        } catch (error) {
            this.logger.error(`Error saving refresh token for user: ${userId}`, error.stack);
            throw new InternalServerErrorException('Could not save refresh token');
        }
    }

    private getSecondsFromExpireTime(expireTime: string): number {
        try {
            const timeValue = parseInt(expireTime.slice(0, -1));
            const timeUnit = expireTime.slice(-1);

            switch (timeUnit) {
                case 'd':
                    return timeValue * 24 * 60 * 60;
                case 'h':
                    return timeValue * 60 * 60;
                case 'm':
                    return timeValue * 60;
                case 's':
                    return timeValue;
                default:
                    throw new Error('Invalid expire time format');
            }
        } catch (error) {
            this.logger.error('Error converting expiration time', error.stack);
            throw new InternalServerErrorException('Error converting expiration time');
        }
    }

    async validateRefreshToken(refreshToken: string): Promise<User> {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: this.appConfigService.jwtRefreshSecretKey,
            });

            const userId = payload.sub;
            const storedToken = await this.redisClient.get(`refresh_token:${userId}`);

            if (storedToken !== refreshToken) {
                throw new UnauthorizedException('Invalid refresh token');
            }

            const user = await this.userService.findById(userId);
            if (!user) {
                throw new UnauthorizedException('User not found');
            }

            return user;
        } catch (error) {
            this.logger.error('Error validating refresh token', error.stack);
            throw new UnauthorizedException('Invalid or expired refresh token');
        }
    }

    async login(user: any): Promise<AuthResponseDto> {

        try {
            const accessToken = await this.generateAccessToken(user);
            const refreshToken = await this.generateRefreshToken(user);

            return plainToInstance(
                AuthResponseDto,
                {
                    accessToken,
                    refreshToken,
                    userId: user.id,
                    username: user.username,
                },
                { excludeExtraneousValues: true },
            );

        } catch (error) {
            this.logger.error(`Error during login`, error.stack);
            throw new InternalServerErrorException('Error during login');
        }
    }

    async logout(userId: string) {
        try {
            await this.redisClient.del(`refresh_token:${userId}`);
        } catch (error) {
            this.logger.error(`Error during logout for user: ${userId}`, error.stack);
            throw new InternalServerErrorException('Error during logout');
        }
    }
}
