import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RdfInterceptor } from 'Global/interceptors/rdf.interceptor';
import { InboxController } from './controllers/inbox.controller';
import { InboxService } from './services/inbox.service';
@Module({
    providers: [
        InboxService,
        {
            provide: APP_INTERCEPTOR,
            useClass: RdfInterceptor,
        },
    ],
    controllers: [InboxController],
})
export class InboxModule {}
