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
  })
  @ApiResponse({
    status : 401,
    description : '이메일 또는 비밀번호 확인해주세요.',
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
  })
  @ApiResponse({
    status : 401,
    description : '유효하지 않은 토큰입니다.',
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
  })
  @ApiResponse({
    status : 401,
    description : '권한이 없습니다.',
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
