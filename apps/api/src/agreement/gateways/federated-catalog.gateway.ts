import { CACHE_MANAGER, Inject, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ConfigService } from '@nestjs/config';
import { BaseGateway } from '../../common/api/base.gateway';
import { ConfigType } from '../../config/config.module';
import { buildDataAssetFromPresentation } from '../dtos/data-asset.dto';

@Injectable()
export class FederatedCatalogGateway extends BaseGateway {
  constructor(
    @Inject(CACHE_MANAGER) protected cache: Cache,
    @InjectQueue('{processSds}') private readonly sdsQueue: Queue,
    readonly configService: ConfigService<ConfigType>,
  ) {
    super(configService.get('gateway', { infer: true }).federatedCatalog);
  }

  public async getDataAsset(access_token: string, dataAssetId: string) {
    try {
      const cachedSD = await this.cache.get(dataAssetId);

      if (cachedSD) {
        return cachedSD;
      }

      // For request we are using mocks, make sure you remove the mocks once FC is reary
      const res: any = await this.request(`/api/self-descriptions?ids=${dataAssetId}&withContent=true`, 'GET', access_token);
      if (res && res.items.length > 0) {
        const dataAssetRes = buildDataAssetFromPresentation(JSON.parse(res.items[0].content || ""));
        await this.cache.set(dataAssetId, dataAssetRes);
        await this.sdsQueue.add('sds', JSON.stringify(dataAssetRes), {
          repeat: {
            limit: this.configService.get('general.sdQueueRetry', { infer: true }),
            every: this.configService.get('general.sdQueueDelay', { infer: true }),
          },
        });
        return dataAssetRes;
      }

      return res.items;
    } catch (e) {
      if (e instanceof Error) {
        throw new ServiceUnavailableException(e.message);
      }
      throw new ServiceUnavailableException();
    }
  }

  
  public async getParticipant(access_token: string, participantDID: string): Promise<any>{
    try {
      // console.log('participantDID', JSON.stringify(participantDID));
      // const cachedProof = await this.cache.get(`participant-${participantDID}`);
      // console.log('cachedProof', JSON.stringify(cachedProof));

      // if (cachedProof !== undefined && cachedProof !== null) {
      //   return cachedProof;
      // }
      
      const url = `/api/self-descriptions?ids=${encodeURIComponent(participantDID)}`;
      const res = await this.request(url, 'GET', access_token);

      // await this.cache.set(`participant-${participantDID}`, res, {
      //   ttl: this.configService.get('general.cache.ttl', { infer: true }),
      // });

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
      const res = await this.request(`/api/actuator/health`, 'GET');
      return res;
    } catch (e) {
      if (e instanceof Error) {
        throw new ServiceUnavailableException(e.message);
      }
      throw new ServiceUnavailableException();
    }
  }
}
