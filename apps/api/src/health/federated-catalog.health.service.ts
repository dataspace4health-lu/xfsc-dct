import { HealthCheckError, HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import { FederatedCatalogAdapter } from '../agreement/adapters/federated-catalog.adapter';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FederatedCatalogHealthService extends HealthIndicator {
  constructor(private readonly federatedCatalog: FederatedCatalogAdapter) {
    super();
  }

  async check() {
    const federatedCatalogueStatus = await this.federatedCatalog.isHealthy();
    return federatedCatalogueStatus;
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    if (!(await this.check())) {
      throw new HealthCheckError('Federated catalogue is down', this.getStatus(key, false));
    }

    return this.getStatus(key, true);
  }
}
