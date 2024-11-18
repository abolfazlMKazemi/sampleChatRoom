// src/auth/dto/message-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class MessageResponseRegisterDto {
    @ApiProperty({ description: 'Response message' })
    message: string;
}
