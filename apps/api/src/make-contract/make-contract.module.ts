import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GlobalModule } from '../global/global.module';
import { RdfInterceptor } from '../global/interceptors/rdf.interceptor';
import { MakeContractController } from './controllers/make-contract.controller';
import { MakeContractService } from './services/make-contract.service';
@Module({
  imports: [GlobalModule],
  providers: [
    MakeContractService,
    {
      provide: APP_INTERCEPTOR,
      useClass: RdfInterceptor,
    },
  ],
  controllers: [MakeContractController],
})
export class MakeContractModule {}
