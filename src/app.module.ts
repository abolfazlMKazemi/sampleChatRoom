import { Module } from '@nestjs/common';
import { AppConfigModule } from './app-config/app-config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigService } from './app-config/app-config.service';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';
import { ChatModule } from './chat/chat.module';
import { ChatRoom } from './chat/entities/chat-room.entity';
import { MessageModule } from './message/message.module';
import { Message } from './message/entities/message.entity';

@Module({
  imports: [AppConfigModule, TypeOrmModule.forRootAsync({
    imports: [AppConfigModule],
    inject: [AppConfigService],
    useFactory: (config: AppConfigService) => ({
      type: 'postgres',
      host: config.databaseHost,
      port: config.databasePort,
      username: config.databaseUsername,
      password: config.databasePassword,
      database: config.databaseName,
      entities: [User, ChatRoom, Message],
      synchronize: true,
    }),
  }),
    UserModule,
    AuthModule,
    RedisModule,
    ChatModule,
    MessageModule],
})
export class AppModule { }
