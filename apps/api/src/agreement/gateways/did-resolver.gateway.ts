import { CACHE_MANAGER, Inject, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { BaseGateway } from '../../common/api/base.gateway';
import { ConfigType } from '../../config/config.module';
import { DIDTrustServiceGateway } from '@gaia-x/gaia-x-vc';

@Injectable()
export class DidResolverGateway extends BaseGateway implements DIDTrustServiceGateway {
  constructor(@Inject(CACHE_MANAGER) protected cache: Cache, readonly configService: ConfigService<ConfigType>) {
    super(configService.get('gateway', { infer: true }).didResolverService);
  }

  public async getParticipantKey(participantDID: string) {
    try {
      const cachedProof = await this.cache.get(participantDID);

      if (cachedProof !== undefined && cachedProof !== null) {
        return cachedProof;
      }

      const res = await this.request(`/get-key?did=${participantDID}`, 'GET');
      await this.cache.set(`participant-key-${participantDID}`, res, {
        ttl: this.configService.get('general.cache.ttl', { infer: true }),
      });
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
