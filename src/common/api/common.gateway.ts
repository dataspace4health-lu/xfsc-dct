import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { GaxProof } from '../dtos/contract.dto';
import { BaseGateway } from 'src/common/api/base.gateway';

@Injectable()
export class CommonGateway extends BaseGateway {
  constructor(protected cache: Cache) {
    super('http://example.com');
  }

  public async checkProvider(proof: GaxProof) {
    try {
      const cachedProof = this.cache.get(proof.verificationMethod);

      if (cachedProof !== undefined) {
        return cachedProof;
      }

      const res = this.request('/checkProvider', 'POST', proof);
      this.cache.set(proof.verificationMethod, JSON.stringify(proof), { ttl: 86400 });

      return res;
    } catch (e) {
      // @TODO: if e is an instace of Error check the message and throw the error based on that
      throw new ServiceUnavailableException();
    }
  }

  public async checkConsumer(proof: GaxProof) {
    try {
      const cachedProof = this.cache.get(proof.verificationMethod);

      if (cachedProof !== undefined) {
        return cachedProof;
      }

      const res = this.request('/checkConsumer', 'POST', proof);
      this.cache.set(proof.verificationMethod, JSON.stringify(proof), { ttl: 86400 });

      return res;
    } catch (e) {
      // @TODO: if e is an instace of Error check the message and throw the error based on that
      throw new ServiceUnavailableException();
    }
  }

  public async checkSignature(proof: GaxProof) {
    try {
      const cachedProof = this.cache.get(proof.verificationMethod);

      if (cachedProof !== undefined) {
        return cachedProof;
      }

      const res = this.request('/checkSignature', 'POST', proof);
      this.cache.set(proof.verificationMethod, JSON.stringify(proof), { ttl: 86400 });

      return res;
    } catch (e) {
      // @TODO: if e is an instace of Error check the message and throw the error based on that
      throw new ServiceUnavailableException();
    }
  }

  public async checkSignatures(signatures: GaxProof[]) {
    // signatures.forEach((signature) => {
    //   const cachedProof = this.cache.get(proof.verificationMethod);

    //   if (cachedProof !== undefined) {
    //     return cachedProof;
    //   }
    // });

    return this.request('/checkSignatures', 'POST', signatures);
  }

  public async addSignature() {
    try {
      return this.request('/addSignature', 'GET');
    } catch (e) {
      // @TODO: if e is an instace of Error check the message and throw the error based on that
      throw new ServiceUnavailableException();
    }
  }
}
