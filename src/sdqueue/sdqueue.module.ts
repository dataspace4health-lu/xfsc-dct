import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GlobalModule } from 'Global/global.module';
import { RdfInterceptor } from 'Global/interceptors/rdf.interceptor';
import { SdqueueController } from './controllers/sdqueue.controller';
import { SdqueueProcessor } from './processors/sdqueue.processor';
@Module({
  imports: [
    GlobalModule,
    BullModule.registerQueue({
      name: 'processSds'
    })
  ],
  providers: [
    SdqueueProcessor,
    {
      provide: APP_INTERCEPTOR,
      useClass: RdfInterceptor
    }
  ],
  controllers: [SdqueueController]
})
export class NegotiateModule {}
