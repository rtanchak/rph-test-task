import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';

async function bootstrap() {

  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const config = new DocumentBuilder()
    .setTitle('Redcare GitHub Search API')
    .setDescription('Search repositories on GitHub with custom scoring')
    .setVersion('1.0.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer' }, 'github-token') // опційно
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    jsonDocumentUrl: '/docs/json',
  });

  app.useLogger(app.get(Logger));

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  }));

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
