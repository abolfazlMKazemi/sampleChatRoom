import { Module, Global } from '@nestjs/common';
import Redis from 'ioredis';
import { AppConfigModule } from '../app-config/app-config.module';
import { AppConfigService } from '../app-config/app-config.service';

@Global()
@Module({
    imports: [AppConfigModule],
    providers: [
        {
            provide: 'REDIS_CLIENT',
            useFactory: async (configService: AppConfigService) => {
                const redis = new Redis({
                    host: configService.redisHost,
                    port: configService.redisPort,
                });
                return redis;
            },
            inject: [AppConfigService],
        },
    ],
    exports: ['REDIS_CLIENT'],
})
export class RedisModule { }
