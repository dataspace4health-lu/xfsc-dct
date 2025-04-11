import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { HealthController } from './health.controller';
import { RedisHealthService } from './redis.health.service';
import { FederatedCatalogHealthService } from './federated-catalog.health.service';
import { AgreementModule } from '../agreement/agreement.module';

@Module({
  imports: [TerminusModule, HttpModule, AgreementModule],
  controllers: [HealthController],
  providers: [RedisHealthService, FederatedCatalogHealthService],
  exports: [RedisHealthService, FederatedCatalogHealthService],
})
export class HealthModule {}
