// user.service.ts
import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);

    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) { }
    async create(userData: Partial<User>): Promise<User> {
        try {
            // Check if username already exists
            const existingUser = await this.usersRepository.findOne({
                where: { username: userData.username },
            });

            if (existingUser) {
                throw new BadRequestException('Username is already taken');
            }

            // Create and save the user
            const user = this.usersRepository.create(userData);
            const savedUser = await this.usersRepository.save(user);

            this.logger.log(`User created with ID: ${savedUser.id}`);
            return savedUser;
        } catch (error) {
            this.logger.error('Error creating user', error.stack);

            // Wrap and rethrow the error to avoid leaking internal details
            if (error instanceof BadRequestException) {
                throw error;
            }

            throw new InternalServerErrorException('Failed to create user');
        }
    }


    async findByUsername(username: string): Promise<User> {
        try {
            const user = await this.usersRepository.findOne({ where: { username } });
            if (!user) {
                this.logger.warn(`User with username "${username}" not found`);
                throw new NotFoundException('User not found');
            }

            this.logger.log(`User with username "${username}" found: ID ${user.id}`);
            return user;
        } catch (error) {
            this.logger.error(
                `Error finding user with username "${username}"`,
                error.stack,
            );
            throw error;
        }
    }

    async findById(id: string): Promise<User> {
        try {
            const user = await this.usersRepository.findOne({ where: { id } });
            if (!user) {
                this.logger.warn(`User with ID "${id}" not found`);
                throw new NotFoundException('User not found');
            }

            this.logger.log(`User with ID "${id}" found: username ${user.username}`);
            return user;
        } catch (error) {
            this.logger.error(`Error finding user with ID "${id}"`, error.stack);
            throw error;
        }
    }
}
