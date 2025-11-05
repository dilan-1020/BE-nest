import { ApiProperty } from '@nestjs/swagger'

export class CreateUserDto {
    @ApiProperty({
        example : "dilan",
        description : "이름",
        required : true
    })
    name: string;
    @ApiProperty({
        example : "dilan@netsream.co.kr",
        description : "이메일",
        required : true
    })
    email: string;
    @ApiProperty({
        example : "dilan124@@",
        description : "비밀번호",
        required : true
    })
    password: string;
    @ApiProperty({
        example : "010-1111-2222",
        description : "전화번호",
        required : true
    })
    phone_number: string;
}

export class LoginUserDto {
    email: string;
    password: string;
}

// Response DTO (비밀번호 등 민감한 정보 제외)
export class UserResponseDto {
    id: number;
    name: string;
    email: string;
    phone_number: string;
    createdAt: Date;
    updatedAt: Date;
}