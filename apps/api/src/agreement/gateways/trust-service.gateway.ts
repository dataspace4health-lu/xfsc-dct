import { CACHE_MANAGER, Inject, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ConfigService } from '@nestjs/config';
import { BaseGateway } from '../../common/api/base.gateway';
import { ConfigType } from '../../config/config.module';

@Injectable()
export class TrustServiceGateway extends BaseGateway {
    constructor(
        @Inject(CACHE_MANAGER) protected cache: Cache,
        readonly configService: ConfigService<ConfigType>) {
        super(configService.get('gateway', { infer: true }).trustService);
    }

    public async getParticipant(participantDID: string) {
        try {
            const cachedProof = await this.cache.get(participantDID);

            if (cachedProof !== undefined && cachedProof !== null) {
                return cachedProof;
            }

            const res = await this.request(`/get-participant?did=${participantDID}`, 'GET');

            await this.cache.set(`participant-${participantDID}`, res, { ttl: this.configService.get('general.cache.ttl', { infer: true }) });

            return res
        } catch (e) {
            // @TODO: if e is an instace of Error check the message and throw the error based on that
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
            await this.cache.set(`participant-key-${participantDID}`, res, { ttl: this.configService.get('general.cache.ttl', { infer: true }) });
            return res
        } catch (e) {
            // @TODO: if e is an instace of Error check the message and throw the error based on that
            throw new ServiceUnavailableException();
        }
    }




}
