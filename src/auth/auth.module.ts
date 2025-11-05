import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './security/passport.jwt';


@Module({
    imports: [UsersModule,
        JwtModule.register({
            secret : 'secret',
            signOptions: { expiresIn : '300s'}, // Access token: 5분
        }),
        PassportModule
    ],
    providers: [
        JwtStrategy,
        {
            provide: 'JWT_REFRESH',
            useFactory: () => {
                const options: JwtModuleOptions = {
                    secret: 'refresh_secret',
                    signOptions: { expiresIn: '7d' }, // Refresh token: 7일
                };
                return new JwtService(options);
            },
        },
    ],
    controllers: [AuthController],
})
export class AuthModule {}