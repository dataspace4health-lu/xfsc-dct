import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GlobalModule } from '../global/global.module';
import { RdfInterceptor } from '../global/interceptors/rdf.interceptor';
import { ContractsController } from './controllers/contracts.controller';
import { ContractsService } from './services/contracts.service';
@Module({
  imports: [GlobalModule],
  providers: [
    ContractsService,
    {
      provide: APP_INTERCEPTOR,
      useClass: RdfInterceptor,
    },
  ],
  controllers: [ContractsController],
})
export class ContractsModule {}
