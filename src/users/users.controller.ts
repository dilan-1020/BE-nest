import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UserResponseDto } from './dto/users.dto';


@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get('health')
    healthCheck() {
        return { message: 'Users API is working!', status: 'ok' };
    }

    @Post()
    async createUser(@Body() createUserDto: CreateUserDto): Promise<{ message: string }> {
        await this.usersService.createUser(createUserDto);
        return { message: '회원가입이 완료되었습니다.' };
    }

    
}
