import { HealthCheckError, HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import { FederatedCatalogAdapter } from '../agreement/adapters/federated-catalog.adapter';

export class FederatedCatalogHealthService extends HealthIndicator {
  constructor(private readonly federatedCatalog: FederatedCatalogAdapter) {
    super();
  }

  check() {
    console.warn('Add health check for Faderated Catalog when microservice is ready.');
    return true;
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    if (!(await this.check())) {
      throw new HealthCheckError('Redis is down', this.getStatus(key, false));
    }

    return this.getStatus(key, true);
  }
}
