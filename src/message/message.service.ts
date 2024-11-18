// src/message/message.service.ts
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';

import { Message } from './entities/message.entity';
import { UserService } from 'src/user/user.service';
import { ChatService } from 'src/chat/chat.service';
import { MessageResponseDto } from './dto/message-response.dto';
import { MessagesResponseDto } from './dto/messages-response.dto';

@Injectable()
export class MessageService {
    private readonly logger = new Logger(MessageService.name);

    constructor(
        @InjectRepository(Message)
        private readonly messageRepository: Repository<Message>,
        private readonly chatService: ChatService,
        private readonly userService: UserService,
    ) { }

    // Send a message in a chat room
    async sendMessage(
        chatRoomId: string,
        userId: string,
        content: string,
    ): Promise<MessageResponseDto> {
        try {
            const chatRoom = await this.chatService.getChatRoomById(chatRoomId);
            if (!chatRoom) {
                this.logger.warn(`Chat room with ID ${chatRoomId} not found`);
                throw new NotFoundException('Chat room not found');
            }

            const user = await this.userService.findById(userId);
            if (!user) {
                this.logger.warn(`User with ID ${userId} not found`);
                throw new NotFoundException('User not found');
            }

            const message = this.messageRepository.create({ content, chatRoom, user });
            const savedMessage = await this.messageRepository.save(message);

            this.logger.log(
                `Message sent by user ID ${userId} in chat room ID ${chatRoomId}: ${content}`,
            );

            return plainToInstance(
                MessageResponseDto,
                {
                    id: savedMessage.id,
                    content: savedMessage.content,
                    chatRoomId: chatRoom.id,
                    userId: user.id,
                    createdAt: savedMessage.createdAt,
                },
                { excludeExtraneousValues: true },
            );
        } catch (error) {
            this.logger.error(
                `Error sending message in chat room ID ${chatRoomId} by user ID ${userId}`,
                error.stack,
            );
            throw error;
        }
    }

    // Retrieve messages of a chat room
    async getMessages(chatRoomId: string): Promise<MessagesResponseDto> {
        try {
            const messages = await this.messageRepository.find({
                where: { chatRoom: { id: chatRoomId } },
                relations: ['chatRoom', 'user'], // Include chatRoom and user relations
                order: { createdAt: 'ASC' },
            });

            if (messages.length === 0) {
                this.logger.warn(`No messages found for chat room ID ${chatRoomId}`);
                throw new NotFoundException('No messages found for the given chat room');
            }

            const chatRoom = messages[0].chatRoom;
            const user = messages[0].user;

            this.logger.log(
                `Retrieved ${messages.length} messages for chat room ID ${chatRoomId}`,
            );

            return plainToInstance(
                MessagesResponseDto,
                {
                    chatRoomId: chatRoom.id,
                    chatRoomCreatedAt: chatRoom.createdAt,
                    userId: user.id,
                    messages: messages.map((message) => ({
                        id: message.id,
                        content: message.content,
                        createdAt: message.createdAt,
                    })),
                },
                { excludeExtraneousValues: true },
            );
        } catch (error) {
            this.logger.error(`Error retrieving messages for chat room ID ${chatRoomId}`, error.stack);
            throw error;
        }
    }
}
