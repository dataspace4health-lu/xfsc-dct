import { Injectable } from '@nestjs/common';
import { BaseGateway } from 'src/common/api/base.gateway';

@Injectable()
export class RegisterGateway extends BaseGateway {
  constructor() {
    super('http://example.com');
  }

  public async checkProvider(jws: string) {
    return this.request('/checkProvider', 'POST', jws);
  }

  public async checkSignature(signature: string) {
    return this.request('/checkSignature', 'POST', signature);
  }

  public async addSignature() {
    return this.request('/addSignature', 'POST');
  }
}
