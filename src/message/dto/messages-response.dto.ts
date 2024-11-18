import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class SingleMessageDto {
    @ApiProperty({ description: 'Message ID' })
    @Expose()
    id: string;

    @ApiProperty({ description: 'Message content' })
    @Expose()
    content: string;

    @ApiProperty({ description: 'Message creation timestamp' })
    @Expose()
    createdAt: Date;
}

export class MessagesResponseDto {
    @ApiProperty({ description: 'Chat room ID' })
    @Expose()
    chatRoomId: string;

    @ApiProperty({ description: 'Chat room creation timestamp' })
    @Expose()
    chatRoomCreatedAt: Date;

    @ApiProperty({ description: 'User ID of the sender' })
    @Expose()
    userId: string;

    @ApiProperty({
        description: 'List of messages',
        type: SingleMessageDto,
        isArray: true,
    })
    @Expose()
    @Type(() => SingleMessageDto)
    messages: SingleMessageDto[];
}
