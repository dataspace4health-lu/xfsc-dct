import { Injectable } from '@nestjs/common';
import { BaseGateway } from '../../common/api/base.gateway';
import { ContractDto } from '../../gateways/dtos/contract.dto';

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
