import { Injectable } from '@nestjs/common';
import { ContractDto } from 'Gateways/dtos/contract.dto';
import { BaseGateway } from 'src/common/api/base.gateway';

@Injectable()
export class MakeContractGateway extends BaseGateway {
  constructor() {
    super('http://example.com');
  }

  public async addContractSignature(providerSignature: string, consumerSignature: string) {
    return await this.request('/addContractSignature', 'POST', { providerSignature, consumerSignature });
  }
  public async dataProviderDistribution(contractDto: ContractDto) {
    return await this.request('/dataProvider/distribution', 'POST', { contractDto });
  }
  public async dataConsumerDistribution(contractDto: ContractDto) {
    return await this.request('/dataConsumer/distribution', 'POST', { contractDto });
  }
}
