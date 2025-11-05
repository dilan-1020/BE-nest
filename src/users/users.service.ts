import { Injectable, NotFoundException, Inject, ConflictException } from '@nestjs/common';
import { User } from './entity/user.entity';
import { CreateUserDto, UserResponseDto } from './dto/users.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from "bcryptjs";

@Injectable()   
export class UsersService {
    constructor(
        @Inject(UsersRepository)
        private usersRepository: UsersRepository,
    ) {}

    async createUser(createUserDto: CreateUserDto): Promise<void> {
        // 이메일 중복 체크
        const existingUser = await this.usersRepository.findByEmail(createUserDto.email);
        
        if (existingUser) {
            throw new ConflictException(`이미 사용 중인 이메일입니다.`);
        }
        
        // 비밀번호 해시화
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        
        // DTO → Entity 변환 (Service 계층에서 처리)
        const user = new User();
        user.name = createUserDto.name;
        user.email = createUserDto.email;
        user.password = hashedPassword;
        user.phone_number = createUserDto.phone_number;
        user.refresh_token = '';
        
        await this.usersRepository.save(user);
    }

    async findAllUsers(): Promise<UserResponseDto[]> {
        const users = await this.usersRepository.findAllUsers();
        // Entity → Response DTO 변환 (비밀번호 제외)
        return users.map(user => ({
            userid: user.userid,
            name: user.name,
            email: user.email,
            phone_number: user.phone_number,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }));
    }
    
    async findByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findByEmail(email);
    }

    async findById(userid: number): Promise<User | null> {
        return this.usersRepository.findById(userid);
    }

    async updateRefreshToken(userid: number, refreshToken: string): Promise<void> {
        return this.usersRepository.updateRefreshToken(userid, refreshToken);
    }

    async findByRefreshToken(refreshToken: string): Promise<User | null> {
        return this.usersRepository.findByRefreshToken(refreshToken);
    }
}