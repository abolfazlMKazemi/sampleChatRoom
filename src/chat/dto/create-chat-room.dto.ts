import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class CreateChatRoomDto {
    @ApiProperty({ description: 'Chat room name' })
    @IsNotEmpty()
    @IsString()
    @MinLength(3, { message: 'Chat room name must be at least 3 characters long' })
    @MaxLength(50, { message: 'Chat room name must not exceed 50 characters' })
    name: string;
}
