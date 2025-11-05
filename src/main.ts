import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import {SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  

  app.enableCors({
    origin : [configService.get('LOCAL_HOST')],
    Credential:true,
    exposedHeaders : ['Authorization'],
  });

  const config = new DocumentBuilder()
    .setTitle("Nest BE API Swagger ")
    .setDescription("Nest BE API 입니다.")
    .setVersion('1.0')
    .addBearerAuth(
      {
      type:'http',
      scheme: 'bearer',
      bearerFormat : 'JWT',
      name : 'JWT',
      description : "Enter JWT Token",
      in: 'header'
      },
      'accessToken')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('swagger', app, documentFactory)

  await app.listen(configService.get("LOCAL_PORT") ?? 3007
  );
  logger.log(`Server is running`);
}
bootstrap();
