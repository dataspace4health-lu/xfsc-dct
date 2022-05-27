import { CACHE_MANAGER, Inject, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { GaxProof } from 'src/gateways/dtos/contract.dto';
import { BaseGateway } from 'src/common/api/base.gateway';

@Injectable()
export class CommonGateway extends BaseGateway {
  constructor(@Inject(CACHE_MANAGER) protected cache: Cache) {
    super('http://example.com');
  }

  public async checkUser(providerDID: string) {
    try {
      const cachedProof = await this.cache.get(providerDID);

      if (cachedProof !== undefined && cachedProof !== null) {
        return cachedProof;
      }

      const res = await this.request('/checkProvider', 'POST', providerDID);

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
    let valid = false;

    for (const signature of signatures) {
      await this.checkSignature(signature);
    }

    return { isValid: valid };
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
