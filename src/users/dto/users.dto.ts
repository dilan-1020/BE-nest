export class CreateUserDto {
    name: string;
    email: string;
    password: string;
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