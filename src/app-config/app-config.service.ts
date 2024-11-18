import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
    constructor(private readonly configService: ConfigService) { }

    get databaseHost(): string {
        return this.configService.get<string>('DATABASE_HOST');
    }

    get databasePort(): number {
        return this.configService.get<number>('DATABASE_PORT');
    }

    get databaseUsername(): string {
        return this.configService.get<string>('DATABASE_USERNAME');
    }

    get databasePassword(): string {
        return this.configService.get<string>('DATABASE_PASSWORD');
    }

    get databaseName(): string {
        return this.configService.get<string>('DATABASE_NAME');
    }


    //redis
    get redisHost(): string {
        return this.configService.get<string>('REDIS_HOST');
    }

    get redisPort(): number {
        return Number(this.configService.get<number>('REDIS_PORT'))
    }


    //jwt
    get expiresInAccessKey(): string {
        return this.configService.get<string>('EXPIRE_IN_ACCESS_KEY');
    }

    get expiresInRefreshKey(): string {
        return this.configService.get<string>('EXPIRE_IN_REFRESH_KEY');
    }

    get jwtSecretAccessKey(): string {
        return this.configService.get<string>('JWT_SECRET_ACCESS_KEY');
    }

    get jwtRefreshSecretKey(): string {
        return this.configService.get<string>('JWT_REFRESH_SECRET_KEY');
    }


    //Application

    get applicationPort(): number {
        return Number(this.configService.get<number>('APPLICATION_PORT'))
    }


}
