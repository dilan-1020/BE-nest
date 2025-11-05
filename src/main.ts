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
    .setTitle("Nest BE")
    .setDescription("Nest BE")
    .setVersion('1.0')
    .addTag('BE')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, documentFactory)

  await app.listen(configService.get("LOCAL_PORT") ?? 3007
  );
  logger.log(`Server is running`);
}
bootstrap();
