// src/message/dto/message-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class MessageResponseDto {
    @ApiProperty({ description: 'Message ID' })
    @Expose()
    id: string;

    @ApiProperty({ description: 'Message content' })
    @Expose()
    content: string;

    @ApiProperty({ description: 'Chat room ID' })
    @Expose()
    chatRoomId: number;

    @ApiProperty({ description: 'User ID of the sender' })
    @Expose()
    userId: number;

    @ApiProperty({ description: 'Message creation timestamp' })
    @Expose()
    createdAt: Date;
}
