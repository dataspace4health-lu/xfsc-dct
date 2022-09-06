import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { LoggerProvider } from './global/logs/logger.provider';
import { JSONLDValidationPipe } from './global/pipes/json-ld.validation-pipe';

function initSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('DCT')
    .setDescription('DCT')
    .setVersion('v1')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('swagger', app, document);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    bodyParser: false,
  });
  const logger = app.get(LoggerProvider).logger;
  app.useLogger(logger);
  app.useGlobalPipes(new JSONLDValidationPipe({ transform: true }));
  app.enableCors();
  initSwagger(app);
  await app.listen(3000);
}

bootstrap();
