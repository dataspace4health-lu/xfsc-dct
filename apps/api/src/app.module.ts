import { BullModule } from '@nestjs/bull';
import {
  CACHE_MANAGER,
  ClassSerializerInterceptor,
  Inject,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TerminusModule } from '@nestjs/terminus';
import Redis from 'ioredis';
import { join } from 'path';
import { AgreementModule } from './agreement/agreement.module';
import { AppConfigModule, ConfigType } from './config/config.module';
import { GlobalModule } from './global/global.module';
import { JsonBodyParserMiddleware } from './global/middlewares/json.parser.middleware';
import { HealthController } from './health/health.controller';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<ConfigType>) => {
        const { type, host, port, password, nodes, options } = configService.get('redis', { infer: true })
        if (type === 'cluster') {
          return {
            createClient: () => {
              return new Redis.Cluster(nodes, options)
            }
          }
        }
        return {
          redis: {
            host,
            port:port,
            password
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
        '/health',
      ],
      serveRoot: '/ui',
    }),
    AppConfigModule,
    GlobalModule,
    AgreementModule,
    TerminusModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  constructor(@Inject(CACHE_MANAGER) cacheManager) {
    const client = cacheManager.store.getClient();

    client.on('error', (error) => {
      console.log(error);
    });
  }
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JsonBodyParserMiddleware).forRoutes('*', '/ui*');
  }
}
