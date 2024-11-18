// src/chat/dto/message-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class MessageResponseDto {
    @ApiProperty({ description: 'Response message' })
    message: string;
}
