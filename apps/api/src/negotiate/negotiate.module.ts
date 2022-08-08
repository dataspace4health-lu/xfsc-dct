import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GlobalModule } from '../global/global.module';
import { RdfInterceptor } from '../global/interceptors/rdf.interceptor';
import { NegotiateController } from './controllers/negotiate.controller';
import { NegotiateGateway } from './gateways/negotiate.gateway';
import { NegotiateService } from './services/negotiate.service';
@Module({
  imports: [GlobalModule],
  providers: [
    NegotiateService,
    {
      provide: APP_INTERCEPTOR,
      useClass: RdfInterceptor,
    },
    NegotiateGateway,
  ],
  controllers: [NegotiateController],
})
export class NegotiateModule {}
