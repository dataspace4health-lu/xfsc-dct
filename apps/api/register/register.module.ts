import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GlobalModule } from 'Global/global.module';
import { RdfInterceptor } from 'Global/interceptors/rdf.interceptor';
import { RegisterController } from './controllers/register.controller';
import { RegisterService } from './services/register.service';
@Module({
    imports: [GlobalModule],
    providers: [
        RegisterService,
        {
            provide: APP_INTERCEPTOR,
            useClass: RdfInterceptor
        },
    ],
    controllers: [RegisterController]
})

export class RegisterModule {}
