import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GlobalModule } from 'Global/global.module';
import { RdfInterceptor } from 'Global/interceptors/rdf.interceptor';
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
