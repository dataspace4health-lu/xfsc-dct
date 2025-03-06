import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { LoggerProvider } from './global/logs/logger.provider';
import { JSONLDValidationPipe } from './global/pipes/json-ld.validation-pipe';
import { ConfigService } from '@nestjs/config';
//import * as session from 'express-session';
import * as passport from 'passport';

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
  
  const configService = app.get(ConfigService);
  const { port, basePath } = configService.get('general', { infer: true });
  app.setGlobalPrefix(basePath);
  
  const logger = app.get(LoggerProvider).logger;
  app.useLogger(logger);
  app.useGlobalPipes(new JSONLDValidationPipe({ transform: true }));
  app.enableCors();
  initSwagger(app);

  // app.use(session({
  //   secret: 'your-secret-key',
  //   resave: false,
  //   saveUninitialized: false,
  //   cookie: { secure: false }, // Set to true in production with HTTPS
  // }));

  app.use(passport.initialize());
  // app.use(passport.session());

  await app.listen(port);
}

bootstrap();
