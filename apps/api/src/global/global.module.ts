import { CacheModule, Global, Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import * as redisStore from 'cache-manager-redis-store';
import { ConfigType } from '../config/config.module';
import { GlobalExceptionFilter } from './exceptions/global.exception-filter';
import { ValidationExceptionFilter } from './exceptions/validation.exception-filter';
import { SizeLimitInterceptor } from './interceptors/size-limit.interceptor';
import { LoggerProvider } from './logs/logger.provider';

@Global()
@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<ConfigType>) => {
        const config = configService.get('server.throtller', { infer: true });
        return {
          ...config,
          store: 'memory',
        };
      },
    }),
    CacheModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<ConfigType>) => {
        const cacheConfig = {
          ...configService.get('general.cache', { infer: true }),
          isGlobal: true,
        };

        if (cacheConfig.store === 'redis') {
          return {
            ...cacheConfig,
            ...configService.get('redis'),
            store: redisStore,
          };
        }

        return cacheConfig;
      },
    })
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: ValidationExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: SizeLimitInterceptor,
    },
    LoggerProvider,
    Logger,
  ],
  exports: [CacheModule]
})
export class GlobalModule { }
