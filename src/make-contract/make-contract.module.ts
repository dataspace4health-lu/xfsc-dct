import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GlobalModule } from 'Global/global.module';
import { RdfInterceptor } from 'Global/interceptors/rdf.interceptor';
import { MakeContractController } from './controllers/make-contract.controller';
import { MakeContractGateway } from './gateways/make-contract.gateway';
import { MakeContractService } from './services/make-contract.service';
@Module({
  imports: [GlobalModule],
  providers: [
    MakeContractService,
    {
      provide: APP_INTERCEPTOR,
      useClass: RdfInterceptor,
    },
    MakeContractGateway,
  ],
  controllers: [MakeContractController],
})
export class MakeContractModule {}
