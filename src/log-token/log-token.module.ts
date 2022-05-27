import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RdfInterceptor } from 'Global/interceptors/rdf.interceptor';
import { LogTokenController } from './controllers/log-token.controller';
import { LogTokenService } from './services/log-token.service';
@Module({
    providers: [
        LogTokenService,
        {
            provide: APP_INTERCEPTOR,
            useClass: RdfInterceptor,
        },
    ],
    controllers: [LogTokenController],
})
export class LogTokenModule {}
