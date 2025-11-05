import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UserResponseDto } from './dto/users.dto';
import { ApiOperation,ApiResponse } from '@nestjs/swagger'


@Controller('api/users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @ApiOperation({ summary : '회원가입', description: '유저 회원가입'})
    @ApiResponse({
        status : 201,
        description : '회원가입 성공',
        
    })
    @ApiResponse({
        status : 409,
        description : '이미 가입된 계정입니다.',
        schema : {
            properties:{
              message : {
                type : 'string',
                description : 'message',
                example : "이미 사용 중인 이메일입니다."
              },
              error : {
                type : 'string',
                description : 'error',
                example : "Conflict"
              },
              statusCode : {
                type : 'string',
                description : 'statusCode',
                example : "409"
              }
            },
            
          }
    },)
    @ApiResponse({
      status : 500,
      description : '서버 에러',
      
    })
    @Post()
    async createUser(@Body() createUserDto: CreateUserDto): Promise<{ message: string }> {
        await this.usersService.createUser(createUserDto);
        return { message: '회원가입이 완료되었습니다.' };
    }

    
}
