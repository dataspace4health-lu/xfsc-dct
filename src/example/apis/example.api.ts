import { Injectable } from '@nestjs/common';
import { BaseAPI } from 'src/common/api/base.api';

@Injectable()
export class ExampleApi extends BaseAPI {
    constructor() {
        super('http://example.com');
    }

    public async getExample() {
        return this.request('/example', 'GET');
    }
}
