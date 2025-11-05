import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Injectable} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TypeOrmConfig implements TypeOrmOptionsFactory {

    constructor(private configService: ConfigService) {}


    createTypeOrmOptions(): TypeOrmModuleOptions {
        const host = this.configService.get('DB_HOST');
        const port = this.configService.get('DB_PORT');
        const username = this.configService.get('DB_USERNAME');
        const password = this.configService.get('DB_PASSWORD') ;
        const database = this.configService.get('DATABASE_NAME');

        

        return {
            type: 'mysql',
            host,
            port,
            username,
            password,
            database,
            autoLoadEntities: true, // NestJS가 forFeature로 등록된 엔티티를 자동으로 로드
            synchronize: true,
        };
    }
}