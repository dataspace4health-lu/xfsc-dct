import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import validationSchema from './config-validation-schema';
import loggerConfig, { ConfigType as LoggerConfig } from './loaders/logger.config';
import generalConfig, { ConfigType as GeneralConfig } from './loaders/general.config';
import redisConfig, { ConfigType as RedisConfig } from './loaders/redis.config';
import serverConfig, { ConfigType as ServerConfig } from './loaders/server.config';
import gatewayConfig, { ConfigType as GatewayConfig } from './loaders/gateways.config';
import signatureConfig, { ConfigType as SignatureConfig } from './loaders/signature.config';
import logTokenConfig, { ConfigType as LogTokenConfig } from './loaders/log-token.config';
import delsDiscoryConfig, { ConfigType as DelsDiscoryConfig } from './loaders/dels-discovey.config';

export type ConfigType = LoggerConfig & GeneralConfig & RedisConfig & ServerConfig & GatewayConfig & SignatureConfig & LogTokenConfig & DelsDiscoryConfig;

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema,
            load: [generalConfig, loggerConfig, redisConfig, serverConfig, gatewayConfig, signatureConfig, logTokenConfig, delsDiscoryConfig],
        }),
    ],
})
export class AppConfigModule { }
