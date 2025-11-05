import { Controller, Post, Body,Get, UnauthorizedException,UseGuards, Req} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Inject } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { LoginUserDto, RefreshDto } from "./dto/auth.dto";
import * as bcrypt from "bcryptjs";
import { ApiOperation,ApiBearerAuth,ApiBody,ApiResponse } from "@nestjs/swagger"

import { AuthGuard } from "./guard/auth.guard";

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    @Inject('JWT_REFRESH') private readonly jwtRefreshService: JwtService,
  ) {}

  @ApiOperation({ summary : '로그인', description: '유저 로그인 토큰 반환해줍니다.'})
  @ApiResponse({
    status : 201,
    description : '회원가입 성공',
    schema : {
      properties:{
        accessToken : {
          type : 'string',
          description : 'accessToken',
          example : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzYyMzMzNTAyLCJleHAiOjE3NjIzMzM4MDJ9.GJwpbdiXV6aELcK2o_jH8QPfqrlzrm9UZZCqFtDsLqU"
        },
        refreshToken : {
          type : 'string',
          description : 'refreshToken',
          example : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzYyMzMzNTAyLCJleHAiOjE3NjI5MzgzMDJ9.T3GAZ9nTu4xpg6pvPr-VoRRn6PkBp7JMwcRrceAHCnY"
        }
      },
      
    }
    
  })
  @ApiResponse({
    status : 401,
    description : '이메일 또는 비밀번호 확인해주세요.',
    schema : {
      properties:{
        message : {
          type : 'string',
          description : 'message',
          example : "이메일 또는 비밀번호를 확인해 주세요."
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
  })
  @ApiResponse({
    status : 500,
    description : '서버 에러',
    
  })
  @Post('/signin')
  async signin(@Body() authDTO: LoginUserDto) {
    const { email, password } = authDTO;

    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('이메일 또는 비밀번호를 확인해 주세요.');
    }

    const isSamePassword = bcrypt.compareSync(password, user.password);
    if (!isSamePassword) {
      throw new UnauthorizedException('이메일 또는 비밀번호를 확인해 주세요.');
    }

    const payload = {
      id: user.id,
    }
    
    // Access token 생성 (5분)
    const accessToken = this.jwtService.sign(payload);
    
    // Refresh token 생성 (7일)
    const refreshToken = this.jwtRefreshService.sign(payload);
    
    // Refresh token을 DB에 저장
    await this.userService.updateRefreshToken(user.id, refreshToken);

    return { 
      accessToken,
      refreshToken 
    };
  }

  @ApiOperation({ summary : '토큰 재발급',description:'Refresh Token을 이용해 accessToken 재발급 받습니다.'})
  @ApiBody({type : RefreshDto})
  @ApiResponse({
    status : 200,
    description : '토큰 재발급 성공',
    schema : {
      properties:{
        accessToken : {
          type : 'string',
          description : 'accessToken',
          example : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzYyMzMzNTAyLCJleHAiOjE3NjIzMzM4MDJ9.GJwpbdiXV6aELcK2o_jH8QPfqrlzrm9UZZCqFtDsLqU"
        }
      },
      
    }
  })
  @ApiResponse({
    status : 401,
    description : '유효하지 않은 토큰입니다.',
    schema : {
      properties:{
        message : {
          type : 'string',
          description : 'message',
          example : "유효하지 않은 refresh token입니다."
        },
        error : {
          type : 'string',
          description : 'error',
          example : "Unauthorized"
        },
        statusCode : {
          type : 'string',
          description : 'statusCode',
          example : "401"
        }
      },
      
    }
  })
  @ApiResponse({
    status : 500,
    description : '서버 에러',
    
  })
  @Post('/refresh')
  async refresh(@Body() body: { refreshToken: string }) {
    const { refreshToken } = body;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token이 필요합니다.');
    }

    // Refresh token 검증
    let payload;
    try {
      payload = this.jwtRefreshService.verify(refreshToken);
    } catch (error) {
      throw new UnauthorizedException('유효하지 않은 refresh token입니다.');
    }

    // DB에서 refresh token 확인
    const user = await this.userService.findByRefreshToken(refreshToken);
    if (!user) {
      throw new UnauthorizedException('유효하지 않은 refresh token입니다.');
    }

    // 새로운 access token 발급
    const newPayload = {
      id: user.id,
    };
    const accessToken = this.jwtService.sign(newPayload);

    return { accessToken };
  }
  @ApiOperation({ summary : '내 정보확인', description : 'accessToken을 이용해 User 정보를 조회합니다. Swagger 상단 Authorize를 통해 로그인 해주세요.'})
  @UseGuards(AuthGuard)
  @ApiBearerAuth('accessToken')
  @ApiResponse({
    status : 200,
    description : '유저 정보 조회 성공',
    schema : {
      properties:{
        id : {
          type : 'string',
          description : 'id',
          example : "1"
        },
        name : {
          type : 'string',
          description : 'name',
          example : "dilan",
        },
        email : {
          type : 'string',
          description : 'email',
          example : "test@netstream.co.kr",
        },
        password : {
          type : 'string',
          description : 'password',
          example : "$2b$10$kGW/mxCSOS/BiuTzz7MynezWEjsLK5lafNO/tucOi9NY25Dbu6E4W",
        },
        phone_number : {
          type : 'string',
          description : 'phone_number',
          example : "010-1111-2222",
        },
        refresh_token : {
          type : 'string',
          description : 'refresh_token',
          example : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzYyMzMzOTc0LCJleHAiOjE3NjI5Mzg3NzR9.qeNtDUCXF3W4g6JM17QWnPRS7S0Cq6vhI5kQoTPKuT0",
        },
        createdAt : {
          type : 'string',
          description : 'createdAt',
          example : "2025-11-04T18:48:12.526Z",
        },
        updatedAt : {
          type : 'string',
          description : 'updatedAt',
          example : "2025-11-05T00:12:55.000Z",
        }
      },
      
    }
  })
  @ApiResponse({
    status : 401,
    description : '권한이 없습니다.',
    schema : {
      properties:{
        error : {
          type : 'string',
          description : 'error',
          example : "Unauthorized"
        },
        statusCode : {
          type : 'string',
          description : 'statusCode',
          example : "401"
        }
      },
      
    }
  })
  @ApiResponse({
    status : 500,
    description : '서버 에러',
    
  })
  @Get('/')
  async getProfile(@Req() req: any) {
    const user = req.user;
    return user
  }

}
