// src/message/dto/send-message.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class SendMessageDto {
    @ApiProperty({
        description: 'Message content',
        minLength: 1,
        maxLength: 500,
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(1, { message: 'Message content must be at least 1 character long' })
    @MaxLength(500, { message: 'Message content must not exceed 500 characters' })
    content: string;
}
