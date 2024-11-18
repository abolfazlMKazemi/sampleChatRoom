// src/message/entities/message.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
} from 'typeorm';

import { ChatRoom } from '../../chat/entities/chat-room.entity';
import { User } from '../../user/entities/user.entity';

@Entity('messages')
export class Message {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column()
    content: string;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => ChatRoom)
    chatRoom: ChatRoom;

    @ManyToOne(() => User)
    user: User;
}
