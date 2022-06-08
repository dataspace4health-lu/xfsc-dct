import { Injectable } from '@nestjs/common';
import { ContractDto } from 'Gateways/dtos/contract.dto';
import { BaseGateway } from 'src/common/api/base.gateway';

@Injectable()
export class NegotiateGateway extends BaseGateway {
  constructor() {
    super('http://example.com');
  }

  public async notifyConsumer(contractDto: ContractDto) {
    return await this.request('/notifyConsumer', 'POST', { contract: contractDto });
  }

  public async negotiationCheckOriginal(contractDto: ContractDto) {
    return await this.request('/negotiationCheckOriginal', 'POST', { contract: contractDto });
  }
}
