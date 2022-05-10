import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { AuthModule } from './auth/auth.module';
import { AppConfigModule } from './config/config.module';
import { ExampleModule } from './example/example.module';
import { GlobalModule } from './global/global.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
    imports: [
        AppConfigModule,
        GlobalModule,
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
        NotificationsModule,
    ],
    controllers: [],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: ClassSerializerInterceptor,
        },
    ],
})
export class AppModule {}
