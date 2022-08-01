import { Injectable, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { BaseGateway } from 'src/common/api/base.gateway';

@Injectable()
export class AuthorizeGateway extends BaseGateway {
  constructor() {
    super('http://example.com');
  }

  public async validateToken(jwt: any): Promise<boolean> {
    try {
      const res = (await this.request(`/auth`, 'GET')) as unknown as boolean;

      if (!res['example']['isValid'])
        throw new UnauthorizedException();

      return res;
    } catch (e) {
      // @TODO: if e is an instace of Error check the message and throw the error based on that
      throw new ServiceUnavailableException();
    }
  }
}
