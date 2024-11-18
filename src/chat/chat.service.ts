// src/chat/chat.service.ts
import { BadRequestException, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';

import { ChatRoom } from './entities/chat-room.entity';
import { UserService } from 'src/user/user.service';
import { ChatRoomResponseDto } from './dto/chat-room-response.dto';

@Injectable()
export class ChatService {
    private readonly logger = new Logger(ChatService.name);

    constructor(
        @InjectRepository(ChatRoom)
        private readonly chatRoomRepository: Repository<ChatRoom>,
        private readonly userService: UserService,
    ) { }

    // Create a new chat room
    async createChatRoom(name: string, creatorId: string): Promise<ChatRoomResponseDto> {
        try {
            const user = await this.userService.findById(creatorId);
            if (!user) {
                this.logger.warn(`Creator with ID ${creatorId} not found`);
                throw new NotFoundException('Creator not found');
            }

            // Check for duplicate chat room name
            const existingChatRoom = await this.chatRoomRepository.findOne({ where: { name } });
            if (existingChatRoom) {
                this.logger.warn(`Chat room with name "${name}" already exists`);
                throw new BadRequestException('Chat room name already exists');
            }

            const chatRoom = this.chatRoomRepository.create({ name, users: [user] });
            const savedChatRoom = await this.chatRoomRepository.save(chatRoom);

            this.logger.log(`Chat room created: ${savedChatRoom.id}`);
            return plainToInstance(ChatRoomResponseDto, savedChatRoom, {
                excludeExtraneousValues: true,
            });
        } catch (error) {
            this.logger.error('Error creating chat room', error.stack);
            throw error;
        }
    }

    // Add a user to a chat room
    async joinChatRoom(chatRoomId: string, userId: string): Promise<void> {
        try {
            const chatRoom = await this.chatRoomRepository.findOne({
                where: { id: chatRoomId },
                relations: ['users'],
            });

            if (!chatRoom) {
                this.logger.warn(`Chat room with ID ${chatRoomId} not found`);
                throw new NotFoundException('Chat room not found');
            }

            const user = await this.userService.findById(userId);
            if (!user) {
                this.logger.warn(`User with ID ${userId} not found`);
                throw new NotFoundException('User not found');
            }

            if (!chatRoom.users) {
                chatRoom.users = [];
            }

            const isUserAlreadyInRoom = chatRoom.users.some(
                (existingUser) => existingUser.id === userId,
            );

            if (isUserAlreadyInRoom) {
                this.logger.warn(`User with ID ${userId} is already in chat room ${chatRoomId}`);
                throw new BadRequestException('User is already in the chat room');
            }

            chatRoom.users.push(user);
            await this.chatRoomRepository.save(chatRoom);

            this.logger.log(`User with ID ${userId} joined chat room ${chatRoomId}`);
        } catch (error) {
            this.logger.error('Error adding user to chat room', error.stack);
            throw error;
        }
    }

    // Retrieve all chat rooms for a specific user
    async getChatRoomsForUser(userId: string): Promise<ChatRoom[]> {
        try {
            const user = await this.userService.findById(userId);
            if (!user) {
                this.logger.warn(`User with ID ${userId} not found`);
                throw new NotFoundException('User not found');
            }

            const chatRooms = await this.chatRoomRepository
                .createQueryBuilder('chatRoom')
                .innerJoin('chatRoom.users', 'user')
                .where('user.id = :userId', { userId })
                .getMany();

            this.logger.log(`Retrieved ${chatRooms.length} chat rooms for user ID ${userId}`);
            return chatRooms;
        } catch (error) {
            this.logger.error('Error retrieving chat rooms for user', error.stack);
            throw error;
        }
    }

    // Get a chat room by ID
    async getChatRoomById(chatRoomId: string): Promise<ChatRoom> {
        try {
            const chatRoom = await this.chatRoomRepository.findOne({ where: { id: chatRoomId } });
            if (!chatRoom) {
                this.logger.warn(`Chat room with ID ${chatRoomId} not found`);
                throw new NotFoundException('Chat room not found');
            }

            this.logger.log(`Retrieved chat room with ID ${chatRoomId}`);
            return chatRoom;
        } catch (error) {
            this.logger.error(`Error retrieving chat room with ID ${chatRoomId}`, error.stack);
            throw error;
        }
    }
}
