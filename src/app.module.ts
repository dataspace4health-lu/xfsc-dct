import { ClassSerializerInterceptor, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import type { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { AuthModule } from 'Auth/auth.module';
import { AppConfigModule } from 'Config/config.module';
import { ExampleModule } from './example/example.module';
import { GlobalModule } from 'Global/global.module';
import { RdfBodyParserMiddleware } from 'Global/middlewares/rdf.parser.middleware';
import { JsonBodyParserMiddleware } from 'Global/middlewares/json.parser.middleware';
import { RegisterModule } from 'Register/register.module';
import { ValidateModule } from 'Validate/validate.module';
import { LogTokenModule } from './log-token/log-token.module';

@Module({
    imports: [
        AppConfigModule,
        GlobalModule,
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'client'),
            exclude: ['/api*'],
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (config: ConfigService) => {
                const options = config.get<TypeOrmModuleOptions>('database');
                return {
                    ...options,
                    type: 'postgres',
                    entities: [join(__dirname, '**', '*.entity.{ts,js}')],
                    synchronize: true,
                    // logging: true
                } as PostgresConnectionOptions;
            },
        }),
        AuthModule,
        ExampleModule,
        RegisterModule,
        ValidateModule,
        LogTokenModule
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
        consumer.apply(RdfBodyParserMiddleware).forRoutes('/inbox/*', '/example/person');
        consumer.apply(JsonBodyParserMiddleware).exclude('/inbox/*', '/example/person').forRoutes('*');
    }
}
