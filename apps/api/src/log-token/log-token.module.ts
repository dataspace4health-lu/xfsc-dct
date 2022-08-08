import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GlobalModule } from '../global/global.module';
import { RdfInterceptor } from '../global/interceptors/rdf.interceptor';
import { LogTokenController } from './controllers/log-token.controller';
import { LogTokenGateway } from './gateways/log-token.gateway';
import { LogTokenService } from './services/log-token.service';
@Module({
    imports: [GlobalModule],
    providers: [
        LogTokenService,
        {
            provide: APP_INTERCEPTOR,
            useClass: RdfInterceptor
        },
        LogTokenGateway
    ],
    controllers: [LogTokenController]
})
export class LogTokenModule {}
