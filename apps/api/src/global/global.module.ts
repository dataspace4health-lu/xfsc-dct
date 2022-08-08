import { CacheModule, Global, Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import * as redisStore from 'cache-manager-redis-store';
import { GlobalExceptionFilter } from './exceptions/global.exception-filter';
import { LoggerProvider } from './logs/logger.provider';
import { ValidationExceptionFilter } from './exceptions/validation.exception-filter';
import { BullModule } from '@nestjs/bull';
import { SdqueueProcessor } from './processors/sdqueue.processor';
import { AuthorizeGateway } from './gateways/authorize.gateway';
import { ConfigType } from '../config/config.module';
import { CommonGateway } from './gateways/common.gateway';


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
    }),
    BullModule.registerQueue({ name: 'processSds' })
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

    LoggerProvider,
    Logger,
    CommonGateway,
    AuthorizeGateway,
    SdqueueProcessor
  ],
  exports: [CacheModule, CommonGateway, AuthorizeGateway, SdqueueProcessor]
})
export class GlobalModule { }
