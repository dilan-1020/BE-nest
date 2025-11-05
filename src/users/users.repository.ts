import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class UsersRepository {
    private readonly logger = new Logger(UsersRepository.name);

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async save(user: User): Promise<void> {
        this.logger.log(`[SAVE] Saving user with email: ${user.email}`);
        this.logger.log(`[SAVE] Target Table: User`);
        
        await this.userRepository.save(user);
        this.logger.log(`[SAVE] ✅ User saved successfully!`);
    }

    async findAllUsers(): Promise<User[]> {
        this.logger.log(`[FIND ALL] Querying User table...`);
        const users = await this.userRepository.find();
        this.logger.log(`[FIND ALL] ✅ Found ${users.length} users from User table`);
        if (users.length > 0) {
            users.forEach((user, index) => {
                this.logger.log(`[FIND ALL] User ${index + 1}: ID=${user.id}, Email=${user.email}, Name=${user.name}`);
            });
        }
        return users;
    }

    async findByEmail(email: string): Promise<User | null> {
        this.logger.log(`[FIND BY EMAIL] Querying User table for: ${email}`);
        const user = await this.userRepository.findOne({
            where: { email }
        });
        return user || null;
    }

    async findById(id: number): Promise<User | null> {
        this.logger.log(`[FIND BY ID] Querying User table for ID: ${id}`);
        const user = await this.userRepository.findOne({
            where: { id }
        });
        return user || null;
    }

    async updateRefreshToken(id: number, refreshToken: string): Promise<void> {
        this.logger.log(`[UPDATE REFRESH TOKEN] Updating refresh token for user ID: ${id}`);
        await this.userRepository.update(id, { refresh_token: refreshToken });
        this.logger.log(`[UPDATE REFRESH TOKEN] ✅ Refresh token updated successfully`);
    }

    async findByRefreshToken(refreshToken: string): Promise<User | null> {
        this.logger.log(`[FIND BY REFRESH TOKEN] Querying User table...`);
        const user = await this.userRepository.findOne({
            where: { refresh_token: refreshToken }
        });
        return user || null;
    }
}