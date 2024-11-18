// src/message/message.controller.ts
import {
    Controller,
    Post,
    Get,
    Body,
    Param,
    UseGuards,
    Request,
    ParseUUIDPipe,
} from '@nestjs/common';

import { MessageService } from './message.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SendMessageDto } from './dto/send-message.dto';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MessageResponseDto } from './dto/message-response.dto';
import { MessagesResponseDto } from './dto/messages-response.dto';

@ApiTags('messages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('chat-rooms/:id/messages')
export class MessageController {
    constructor(private messageService: MessageService) { }

    // Send a message
    @Post()
    @ApiBody({ type: SendMessageDto })
    @ApiResponse({ status: 201, description: 'Message sent successfully', type: MessageResponseDto })
    async sendMessage(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() sendMessageDto: SendMessageDto,
        @Request() req,
    ) {
        return this.messageService.sendMessage(
            id,
            req.user.userId,
            sendMessageDto.content,
        );
    }

    // Retrieve messages
    @Get()
    @ApiOkResponse({ description: 'List of messages', type: MessagesResponseDto })
    async getMessages(@Param('id', ParseUUIDPipe) id: string) {
        return this.messageService.getMessages(id);
    }
}
