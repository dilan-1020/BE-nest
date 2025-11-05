import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UserResponseDto } from './dto/users.dto';
import { ApiOperation } from '@nestjs/swagger'


@Controller('api/users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @ApiOperation({ summary : '회원가입'})
    @Post()
    async createUser(@Body() createUserDto: CreateUserDto): Promise<{ message: string }> {
        await this.usersService.createUser(createUserDto);
        return { message: '회원가입이 완료되었습니다.' };
    }

    
}
