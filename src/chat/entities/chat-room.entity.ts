// src/chat/entities/chat-room.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToMany,
    JoinTable,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('chat_rooms')
export class ChatRoom {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToMany(() => User, (user) => user.chatRooms)
    @JoinTable({
        name: 'user_chat_rooms',
        joinColumn: { name: 'chatRoomId', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
    })
    users: User[];
}
