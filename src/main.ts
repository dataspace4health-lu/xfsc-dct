import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerProvider } from './global/logs/logger.provider';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        bufferLogs: true,
    });
    const logger = app.get(LoggerProvider).logger;
    app.useLogger(logger);
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(3000);
}
bootstrap();
