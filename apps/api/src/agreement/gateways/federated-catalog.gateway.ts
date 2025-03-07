import { CACHE_MANAGER, Inject, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ConfigService } from '@nestjs/config';
import { BaseGateway } from '../../common/api/base.gateway';
import { ConfigType } from '../../config/config.module';
import axios from 'axios';

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
      console.warn('Federated Catalog integration impremented with mocks.', JSON.stringify({ res }));

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

  public async getParticipant(participantDID: string) {
    try {
      console.log('participantDID', JSON.stringify(participantDID));
      // const cachedProof = await this.cache.get(`participant-${participantDID}`);
      // console.log('cachedProof', JSON.stringify(cachedProof));

      // if (cachedProof !== undefined && cachedProof !== null) {
      //   return cachedProof;
      // }
      // Prepare URL for fetching participant data
      const url = `/api/participants/${participantDID}`;
      // const url = `http://dataspace4health.local/catalogue/api/participants/8fbaa6ce-c7ac-4478-861b-59db2eadc606`;
      const token = process.env.AUTH_TOKEN; // Get token from environment variable


      const res = await this.request(url, 'GET', {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      
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
//   public async getParticipantDirectAxios(participantDID: string) {
//     const url = `http://dataspace4health.local/catalogue/api/participants/2103fcf8-8d00-431c-afdb-b1e5c5a3021f`;
//     try {
//         const token = process.env.AUTH_TOKEN;

//         console.log('🔵 Fetching participant data from API:', url);
//         console.log('🔵 Using Authorization Token:', token ? 'Token Found' : 'No Token ❌');

//         if (!token) {
//             throw new Error("❌ No AUTH_TOKEN set in environment variables.");
//         }

//         const response = await axios.get(url, {
//             headers: {
//                 'accept': 'application/json',
//                 'Authorization': `Bearer ${token}`,
//             },
//         });

//         console.log('🟢 Full API Response:', response.data);
//         return response.data;
//     } catch (e) {
//         if (e.response) {
//             if (e.response.status === 401) {
//                 console.error('❌ Authentication Error: Invalid or missing token');
//                 throw new ServiceUnavailableException('Unauthorized: Invalid token');
//             } else if (e.response.status === 404) {
//                 console.error('❌ API Error: Endpoint not found', url);
//                 throw new ServiceUnavailableException('Participant not found');
//             }
//         }
//         console.error('❌ getParticipant Error:', e.message);
//         throw new ServiceUnavailableException('Error fetching participant data');
//     }
// }

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
