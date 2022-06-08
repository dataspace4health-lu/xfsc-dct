import { CACHE_MANAGER, Inject, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ContractDto, GaxProof } from 'src/gateways/dtos/contract.dto';
import { BaseGateway } from 'src/common/api/base.gateway';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class CommonGateway extends BaseGateway {
  constructor(
    @Inject(CACHE_MANAGER) protected cache: Cache,
    @InjectQueue('processSds') private readonly sdsQueue: Queue) {
    super('http://example.com');
  }

  // @TODO: the providerDID might have multiple contracts -> this needs to be changed with an assed DID
  // waiting for a valid response from FC in order to determine where is the actual ID stored before changing
  public async checkSD(providerDID: string, document: ContractDto) {
    try {
      const cachedSD = await this.cache.get(providerDID);

      if (cachedSD !== undefined && cachedSD !== null) {
        return { isValid: true };
      }

      const res = await this.request('/checkSD', 'POST', document);

      if (res['example']['isValid']) {
        await this.cache.set(providerDID, document, { ttl: 86400 });
        await this.sdsQueue.add('sds', JSON.stringify(document), { repeat: { limit: 13, every: 3000 } });
      }

      return res['example'];
    } catch (e) {
      throw new ServiceUnavailableException();
    }
  }

  public async checkUser(providerDID: string) {
    try {
      const cachedProof = await this.cache.get(providerDID);

      if (cachedProof !== undefined && cachedProof !== null) {
        return cachedProof;
      }

      const res = await this.request('/checkUser', 'POST', providerDID);

      await this.cache.set(providerDID, res['example'], { ttl: 86400 });

      return res['example'];
    } catch (e) {
      // @TODO: if e is an instace of Error check the message and throw the error based on that
      throw new ServiceUnavailableException();
    }
  }

  public async checkSignature(proof: GaxProof) {
    try {
      const cachedProof = await this.cache.get(proof.verificationMethod);

      if (cachedProof !== undefined && cachedProof !== null) {
        return cachedProof;
      }

      const res = await this.request('/checkSignature', 'POST', proof);
      await this.cache.set(proof.verificationMethod, res['example'], { ttl: 86400 });

      return res['example'];
    } catch (e) {
      // @TODO: if e is an instace of Error check the message and throw the error based on that
      throw new ServiceUnavailableException();
    }
  }

  public async checkSignatures(signatures: GaxProof[]) {
    for (const signature of signatures) {
      const res = await this.checkSignature(signature);

      if (!res) {
        return { isValid: false };
      }
    }

    return { isValid: true };
  }

  public async addSignature() {
    try {
      return await this.request('/addSignature', 'GET');
    } catch (e) {
      // @TODO: if e is an instace of Error check the message and throw the error based on that
      throw new ServiceUnavailableException();
    }
  }
}
