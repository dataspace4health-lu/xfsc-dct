import { Injectable } from '@nestjs/common';
import { BaseGateway } from 'src/common/api/base.gateway';

@Injectable()
export class MakeContractGateway extends BaseGateway {
  constructor() {
    super('http://example.com');
  }

  public async addContractSignature(providerSignature: string, consumerSignature: string) {
    return await this.request('/addContractSignature', 'POST', { providerSignature, consumerSignature });
  }
}
