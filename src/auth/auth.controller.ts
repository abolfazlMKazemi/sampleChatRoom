// src/auth/auth.controller.ts
import {
    Controller,
    Post,
    UseGuards,
    Request,
    Body,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';

import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { MessageResponseRegisterDto } from './dto/message-response.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { AccessTokenDto } from './dto/access-token.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private userService: UserService,
    ) { }

    // User registration
    @Post('register')
    @ApiBody({ type: RegisterUserDto })
    @ApiResponse({
        status: 201,
        description: 'User registered successfully',
        type: MessageResponseRegisterDto,
    })
    async register(@Body() registerUserDto: RegisterUserDto): Promise<MessageResponseRegisterDto> {
        const hashedPassword = await bcrypt.hash(registerUserDto.password, 10);
        await this.userService.create({
            username: registerUserDto.username,
            password: hashedPassword,
        });
        return { message: 'User registered successfully' };
    }

    // User login
    @UseGuards(LocalAuthGuard)
    @Post('login')
    @ApiBody({ type: LoginUserDto })
    @ApiOkResponse({ description: 'User logged in successfully', type: AuthResponseDto })
    async login(@Request() req) {
        return this.authService.login(req.user);
    }


    // Refresh access token
    @UseGuards(JwtRefreshGuard)
    @Post('refresh-token')
    @ApiBody({ type: RefreshTokenDto })
    @ApiOkResponse({ description: 'Access token refreshed successfully', type: AccessTokenDto })
    async refreshToken(
        @Body() refreshTokenDto: RefreshTokenDto,
        @Request() req,
    ) {
        const { refreshToken } = refreshTokenDto;

        const user = await this.authService.validateRefreshToken(refreshToken);

        const accessToken = await this.authService.generateAccessToken(user);

        return { accessToken: accessToken };
    }

    // User logout
    @UseGuards(JwtAuthGuard)
    @Post('logout')
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Logged out successfully', type: MessageResponseRegisterDto })
    async logout(@Request() req) {
        await this.authService.logout(req.user.userId);
        return { message: 'Logged out successfully' };
    }
}
