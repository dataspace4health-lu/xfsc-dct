import { Injectable } from '@nestjs/common';
import { BaseGateway } from 'src/common/api/base.gateway';

@Injectable()
export class ExampleGateway extends BaseGateway {
    constructor() {
        super('http://example.com');
    }

    public async getExample() {
        return this.request('/example', 'GET');
    }
}
