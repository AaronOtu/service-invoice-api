import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv'; 
import { AuthGuard } from './guard/auth.guard'
dotenv.config();


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe)
   const config = new DocumentBuilder()
   .setTitle('Invoice Service API')
   .setDescription('An API to send generated invoices')
   .setVersion('1.0')
   .addBearerAuth()
   .build();

 const document = SwaggerModule.createDocument(app, config);
 SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
