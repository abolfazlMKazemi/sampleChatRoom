// src/chat/chat.controller.ts
import {
    Controller,
    Post,
    Get,
    Body,
    Param,
    UseGuards,
    Request,
    BadRequestException,
    ParseUUIDPipe,
} from '@nestjs/common';

import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MessageResponseDto } from './dto/message-response.dto';
import { ChatRoomResponseDto } from './dto/chat-room-response.dto';

@ApiTags('chat-rooms')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('chat-rooms')
export class ChatController {
    constructor(private chatService: ChatService) { }

    // Create a new chat room
    @Post()
    @ApiBody({ type: CreateChatRoomDto })
    @ApiResponse({ status: 201, description: 'Chat room created successfully', type: ChatRoomResponseDto })
    async createChatRoom(
        @Request() req,
        @Body() createChatRoomDto: CreateChatRoomDto,
    ) {
        if (!req.user || !req.user.userId) {
            throw new BadRequestException('User ID is missing from the request');
        }
        return this.chatService.createChatRoom(createChatRoomDto.name, req.user.userId);
    }

    // Join a chat room
    @Post(':id/join')
    @ApiResponse({ status: 200, description: 'Joined chat room successfully', type: MessageResponseDto })
    async joinChatRoom(
        @Param('id', ParseUUIDPipe) id: string,
        @Request() req,
    ) {
        await this.chatService.joinChatRoom(id, req.user.userId);
        return { message: 'Joined chat room successfully' };
    }


    // Retrieve the list of chat rooms
    @Get()
    @ApiOkResponse({ description: 'List of chat rooms', type: [ChatRoomResponseDto] })
    async getChatRooms(@Request() req) {
        if (!req.user || !req.user.userId) {
            throw new BadRequestException('User ID is missing from the request');
        }
        return this.chatService.getChatRoomsForUser(req.user.userId);
    }
}
