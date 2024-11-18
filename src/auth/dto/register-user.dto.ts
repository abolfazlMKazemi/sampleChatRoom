import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, MaxLength, Matches } from 'class-validator';

export class RegisterUserDto {
    @ApiProperty({ description: 'Username for the user' })
    @IsString()
    @IsNotEmpty({ message: 'Username should not be empty' })
    @MinLength(3, { message: 'Username must be at least 3 characters long' })
    @MaxLength(20, { message: 'Username must not exceed 20 characters' })
    username: string;

    @ApiProperty({ description: 'Password for the user' })
    @IsString()
    @IsNotEmpty({ message: 'Password should not be empty' })
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @MaxLength(30, { message: 'Password must not exceed 30 characters' })
    @Matches(/(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}/, {
        message: 'Password must include at least one letter and one number',
    })
    password: string;
}
