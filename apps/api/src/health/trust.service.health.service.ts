import { HealthCheckError, HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import { TrustServiceAdapter } from '../agreement/adapters/trust-service.adapter';

export class TrustServiceHealthService extends HealthIndicator {
  constructor(private readonly trustServiceAdapter: TrustServiceAdapter) {
    super();
  }

  check() {
    console.warn('Add health check for Trust Services when microservice is ready.');
    return true;
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    if (!this.check()) {
      throw new HealthCheckError('Redis is down', this.getStatus(key, false));
    }

    return this.getStatus(key, true);
  }
}
