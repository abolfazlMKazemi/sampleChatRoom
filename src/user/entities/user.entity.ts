// user.entity.ts
import { ChatRoom } from 'src/chat/entities/chat-room.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToMany } from 'typeorm';


@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToMany(() => ChatRoom, (chatRoom) => chatRoom.users)
    chatRooms: ChatRoom[];
}
