import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class AuthResponseDto {
    @ApiProperty({ description: 'Access token for authentication' })
    @Expose()
    accessToken: string;

    @ApiProperty({ description: 'Refresh token for authentication (optional)' })
    @Expose()
    refreshToken?: string;

    @ApiProperty({ description: 'User ID' })
    @Expose()
    userId: string;

    @ApiProperty({ description: 'Username of the logged-in user' })
    @Expose()
    username: string;
}
