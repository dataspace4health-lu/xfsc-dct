import { CACHE_MANAGER, Inject, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ConfigService } from '@nestjs/config';
import { BaseGateway } from '../../common/api/base.gateway';
import { ConfigType } from '../../config/config.module';

@Injectable()
export class TrustServiceGateway extends BaseGateway {
  constructor(@Inject(CACHE_MANAGER) protected cache: Cache, readonly configService: ConfigService<ConfigType>) {
    super(configService.get('gateway', { infer: true }).trustService);
  }

  public async getParticipant(participantDID: string) {
    try {
      const cachedProof = await this.cache.get(participantDID);

      if (cachedProof !== undefined && cachedProof !== null) {
        return cachedProof;
      }
      // For request we are using mocks, make sure you remove the mocks once TS is reary
      const res = await this.request(`/get-participant?did=${participantDID}`, 'GET');
      console.warn('Trust Services integration impremented with mocks.');

      await this.cache.set(`participant-${participantDID}`, res, {
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
}
