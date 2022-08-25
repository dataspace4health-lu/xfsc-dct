import { BullModule } from '@nestjs/bull';
import { ClassSerializerInterceptor, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AgreementModule } from './agreement/agreement.module';
import { AppConfigModule, ConfigType } from './config/config.module';
import { GlobalModule } from './global/global.module';
import { JsonBodyParserMiddleware } from './global/middlewares/json.parser.middleware';

@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<ConfigType>) => {
        return {
          redis: {
            host: configService.get('redis.host', { infer: true }),
            port: configService.get('redis.port', { infer: true }),
          },
        };
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'ui'), // "ui" is the folder where the UI application is builded
      exclude: [
        '/auth/*',
        '/register',
        '/validate',
        '/log-token',
        '/make-contract',
        '/finalize',
        '/contracts',
        '/negotiate',
      ],
      serveRoot: '/ui',
    }),
    AppConfigModule,
    GlobalModule,
    AgreementModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JsonBodyParserMiddleware).forRoutes('*', '/ui*');
  }
}
