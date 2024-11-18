// src/chat/dto/chat-room-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ChatRoomResponseDto {
    @ApiProperty({ description: 'Chat room ID' })
    @Expose()
    id: string;

    @ApiProperty({ description: 'Chat room name' })
    @Expose()
    name: string;
}
