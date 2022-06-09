import { ClassSerializerInterceptor, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
// import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from 'Auth/auth.module';
import { AppConfigModule, ConfigType } from 'Config/config.module';
import { GlobalModule } from 'Global/global.module';
import { RdfBodyParserMiddleware } from 'Global/middlewares/rdf.parser.middleware';
import { JsonBodyParserMiddleware } from 'Global/middlewares/json.parser.middleware';
import { RegisterModule } from 'Register/register.module';
import { ValidateModule } from 'Validate/validate.module';
import { LogTokenModule } from './log-token/log-token.module';
import { NegotiateModule } from './negotiate/negotiate.module';
import { FinalizeModule } from './finalize/finalize.module';
import { MakeContractModule } from './make-contract/make-contract.module';
import { BullModule } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';

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
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
      exclude: ['/api*'],
    }),
    AuthModule,
    RegisterModule,
    ValidateModule,
    LogTokenModule,
    NegotiateModule,
    MakeContractModule,
    FinalizeModule,
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
    consumer.apply(RdfBodyParserMiddleware).exclude('/login/*').forRoutes('*');
    consumer.apply(JsonBodyParserMiddleware).exclude('/login/*').forRoutes('*');
  }
}
