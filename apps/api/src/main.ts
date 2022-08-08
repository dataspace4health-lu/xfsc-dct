import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerProvider } from './global/logs/logger.provider';
import { JSONLDValidationPipe } from './global/pipes/json-ld.validation-pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    bodyParser: false
  });
  const logger = app.get(LoggerProvider).logger;
  app.useLogger(logger);
  await app.useGlobalPipes(await new JSONLDValidationPipe({ transform: true }));
  // app.setGlobalPrefix('api');
  app.enableCors();
  await app.listen(3000);
}

bootstrap();
