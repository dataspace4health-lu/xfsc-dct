import { ClassSerializerInterceptor, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
// import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { NegotiateModule } from './negotiate/negotiate.module';
import { FinalizeModule } from './finalize/finalize.module';
import { MakeContractModule } from './make-contract/make-contract.module';
import { BullModule } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { ContractsModule } from './contracts/contracts.module';
import { AppConfigModule, ConfigType } from './config/config.module';
import { GlobalModule } from './global/global.module';
import { AuthModule } from './auth/auth.module';
import { RegisterModule } from './register/register.module';
import { ValidateModule } from './validate/validate.module';
import { LogTokenModule } from './log-token/log-token.module';
import { RdfBodyParserMiddleware } from './global/middlewares/rdf.parser.middleware';
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
    AppConfigModule,
    GlobalModule,
    AuthModule,
    RegisterModule,
    ValidateModule,
    LogTokenModule,
    NegotiateModule,
    MakeContractModule,
    FinalizeModule,
    ContractsModule,
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
    consumer.apply(RdfBodyParserMiddleware).exclude( 'auth/login').forRoutes('*');
    consumer.apply(JsonBodyParserMiddleware).forRoutes('*');
  }
}
