import { Injectable } from '@nestjs/common';
import { BaseGateway } from 'src/common/api/base.gateway';

@Injectable()
export class LogTokenGateway extends BaseGateway {
  constructor() {
    super('http://example.com');
  }

  public async getToken(id: string) {
    return await this.request('/getToken', 'GET', id);
  }
}
