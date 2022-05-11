import { CacheModule, Global, Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { ConfigType } from 'Config/config.module';
import { GlobalExceptionFilter } from './exceptions/global.exception-filter';
import { LoggerProvider } from './logs/logger.provider';
import * as redisStore from 'cache-manager-redis-store';
import { ValidationExceptionFilter } from './exceptions/validation.exception-filter';
import { ThrottlerModule } from '@nestjs/throttler';

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
    ],
    exports: [CacheModule],
})
export class GlobalModule {}
