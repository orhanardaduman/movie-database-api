import { config } from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { DocumentBuilder } from '@nestjs/swagger';
import { GlobalExceptionFilter } from './filters/http-exception.filter';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { Logger } from '@nestjs/common';
config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      validateCustomDecorators: true,
      exceptionFactory: (errors) => {
        return new BadRequestException(errors);
      },
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());

  app.useLogger(new Logger());

  const config = new DocumentBuilder()
    .setTitle('Case Study')
    .setDescription(
      'This API provides endpoints for managing and retrieving movie data from TMDB. It includes functionality for fetching popular Netflix movies with high ratings, storing them in a database, and retrieving movie details including genres.',
    )
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
