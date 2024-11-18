import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class LoginUserDto {
    @ApiProperty({ description: 'Username of the user' })
    @IsString()
    @IsNotEmpty({ message: 'Username should not be empty' })
    username: string;

    @ApiProperty({ description: 'Password of the user' })
    @IsString()
    @IsNotEmpty({ message: 'Password should not be empty' })
    password: string;
}
