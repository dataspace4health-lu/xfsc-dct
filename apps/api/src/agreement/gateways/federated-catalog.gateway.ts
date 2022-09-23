import { CACHE_MANAGER, Inject, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ConfigService } from '@nestjs/config';
import { BaseGateway } from '../../common/api/base.gateway';
import { ConfigType } from '../../config/config.module';

@Injectable()
export class FederatedCatalogGateway extends BaseGateway {
  constructor(
    @Inject(CACHE_MANAGER) protected cache: Cache,
    @InjectQueue('{processSds}') private readonly sdsQueue: Queue,
    readonly configService: ConfigService<ConfigType>,
  ) {
    super(configService.get('gateway', { infer: true }).federatedCatalog);
  }

  public async getDataAsset(dataAssetId: string) {
    try {
      const cachedSD = await this.cache.get(dataAssetId);

      if (cachedSD) {
        return cachedSD;
      }

      // For request we are using mocks, make sure you remove the mocks once FC is reary
      const res = await this.request(`/get-data-asset?id=${dataAssetId}`, 'GET');
      console.warn('Federated Catalog integration impremented with mocks.', JSON.stringify({res}));

      if (res) {
        await this.cache.set(dataAssetId, res);
        await this.sdsQueue.add('sds', JSON.stringify(res), {
          repeat: {
            limit: this.configService.get('general.sdQueueRetry', { infer: true }),
            every: this.configService.get('general.sdQueueDelay', { infer: true }),
          },
        });
      }

      return res;
    } catch (e) {
      if (e instanceof Error) {
        throw new ServiceUnavailableException(e.message);
      }
      throw new ServiceUnavailableException();
    }
  }

  public async getHealthStatus() {
    try {
      const res = await this.request(`/health-check`, 'GET');
      return res;
    } catch (e) {
      if (e instanceof Error) {
        throw new ServiceUnavailableException(e.message);
      }
      throw new ServiceUnavailableException();
    }
  }
}
