import { ApiProperty } from '@nestjs/swagger'

export class LoginUserDto {
    @ApiProperty({
        example : "dilan@netsream.co.kr",
        description : "이메일",
        required : true
    })
    email: string;
    @ApiProperty({
        example : "dilan124@@",
        description : "이메일",
        required : true
    })
    password: string;
}

export class RefreshDto {
    @ApiProperty({
        example :"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        description : "재발급에 필요한 Refresh Token 입력해주세요.",
        required : true,
    })
    refreshToken:string;
}