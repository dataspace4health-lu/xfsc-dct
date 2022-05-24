import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { GaxProof } from 'Common/dtos/contract.dto';
import { BaseGateway } from 'src/common/api/base.gateway';

@Injectable()
export class CommonGateway extends BaseGateway {
  constructor() {
    super('http://example.com');
  }

  public async checkProvider(jws: string) {
    try {
      return this.request('/checkProvider', 'POST', jws);
    } catch (e) {
      // @TODO: if e is an instace of Error check the message and throw the error based on that
      throw new ServiceUnavailableException();
    }
  }

  public async checkConsumer(jws: string) {
    try {
      return this.request('/checkConsumer', 'POST', jws);
    } catch (e) {
      // @TODO: if e is an instace of Error check the message and throw the error based on that
      throw new ServiceUnavailableException();
    }
  }

  public async checkSignature(signature: string) {
    try {
      return this.request('/checkSignature', 'POST', signature);
    } catch (e) {
      // @TODO: if e is an instace of Error check the message and throw the error based on that
      throw new ServiceUnavailableException();
    }
  }

  public async checkSignatures(signatures: GaxProof[]) {
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
