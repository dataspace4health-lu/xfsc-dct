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
        return {
          createClient: () => {
            return new Redis.Cluster([
              {
                port: configService.get('redis.port', { infer: true }),
                host: configService.get('redis.host', { infer: true }),
              }
            ],
              {
                maxRedirections: 16,
                slotsRefreshTimeout: 2000,
                dnsLookup: (address, callback) => callback(null, address),
                scaleReads: 'slave',
                redisOptions: {
                  password: configService.get('redis.password', { infer: true }),
                  connectTimeout: 10000
                },
                keyPrefix: configService.get('redis.prefix', { infer: true }),
              })
          }
        }
        return {
          redis: {
            host: configService.get('redis.host', { infer: true }),
            port: configService.get('redis.port', { infer: true }),
            password: configService.get('redis.password', { infer: true })
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
