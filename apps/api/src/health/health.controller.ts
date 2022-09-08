import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheck, HttpHealthIndicator, MemoryHealthIndicator } from '@nestjs/terminus';
import { FederatedCatalogHealthService } from './federated-catalog.health.service';
import { RedisHealthService } from './redis.health.service';
import { TrustServiceHealthService } from './trust.service.health.service';

@Controller('health')
export class HealthController {
  constructor(
    private healthCheckService: HealthCheckService,
    private readonly memory: MemoryHealthIndicator,
    private readonly redisHealthCheckService: RedisHealthService,
    private readonly trustServicesHealthCheckService: TrustServiceHealthService,
    private readonly federatedServicesHealthCheckService: FederatedCatalogHealthService,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.healthCheckService.check([
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      () => this.redisHealthCheckService.isHealthy('redis'),
      () => this.trustServicesHealthCheckService.isHealthy('trust-services'),
      () => this.federatedServicesHealthCheckService.isHealthy('federated-catalog'),
    ]);
  }
}
