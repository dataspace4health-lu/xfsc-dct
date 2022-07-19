import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GlobalModule } from 'Global/global.module';
import { RdfInterceptor } from 'Global/interceptors/rdf.interceptor';
import { ValidateController } from './controllers/validate.controller';
import { ValidateService } from './services/validate.service';
@Module({
    imports: [GlobalModule],
    providers: [
        ValidateService,
        {
            provide: APP_INTERCEPTOR,
            useClass: RdfInterceptor,
        }
    ],
    controllers: [ValidateController],
})
export class ValidateModule {}
