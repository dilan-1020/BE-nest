import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  

  app.enableCors({
    origin : [configService.get('LOCAL_HOST')],
    Credential:true,
    exposedHeaders : ['Authorization'],
  });
  await app.listen(process.env.PORT ?? 3001
  );
  logger.log(`Server is running`);
}
bootstrap();
