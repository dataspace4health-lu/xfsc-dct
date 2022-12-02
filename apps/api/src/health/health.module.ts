import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { HealthController } from './health.controller';
import { RedisHealthService } from './redis.health.service';
import { TrustServiceHealthService } from './trust.service.health.service';
import { FederatedCatalogHealthService } from './federated-catalog.health.service';

@Module({
  imports: [TerminusModule, HttpModule],
  controllers: [HealthController],
  providers: [RedisHealthService, TrustServiceHealthService, FederatedCatalogHealthService],
  exports: [RedisHealthService, TrustServiceHealthService, FederatedCatalogHealthService],
})
export class HealthModule {}
