import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { BaseGateway } from 'src/common/api/base.gateway';
import { LogTokenDto } from '../dtos/log-token.dto';

@Injectable()
export class LogTokenGateway extends BaseGateway {
  constructor() {
    super('http://example.com');
  }

  public async checkSignatures(signatures: LogTokenDto['verifiableCredential'][0]['proof'][]) {
    try {
      return this.request('/checkSignature', 'POST', signatures);
    } catch (e) {
      // @TODO: if e is an instace of Error check the message and throw the error based on that
      throw new ServiceUnavailableException();
    }
  }

  public async getToken(id: string) {
    return this.request('/getToken', 'GET', id);
  }
}
