import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GlobalModule } from '../global/global.module';
import { RdfInterceptor } from '../global/interceptors/rdf.interceptor';
import { FinalizeController } from './controllers/finalize.controller';
import { FinalizeService } from './services/finalize.service';
@Module({
  imports: [GlobalModule],
  providers: [
    FinalizeService,
    {
      provide: APP_INTERCEPTOR,
      useClass: RdfInterceptor,
    },
  ],
  controllers: [FinalizeController],
})
export class FinalizeModule {}
