import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.setGlobalPrefix('api/v1');

  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor()
  );

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: false,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true
    },
  }));

  const config = new DocumentBuilder()
    .setTitle('CMPC Libros API')
    .setDescription('API para la gestión de inventario de CMPC Libros')
    .setVersion('1.0')
    .addBearerAuth() 
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document);


  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
