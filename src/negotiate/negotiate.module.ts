import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GlobalModule } from 'Global/global.module';
import { RdfInterceptor } from 'Global/interceptors/rdf.interceptor';
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
