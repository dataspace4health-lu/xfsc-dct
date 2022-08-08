// import { Injectable } from '@nestjs/common';
// import { DeepPartial } from 'typeorm';
// import { ExampleGateway } from '../gateways/example.gateway';
// import { ExampleDto } from '../dtos/example.dto';
// import { Example } from '../entities/example.entity';
// import { ExampleRepository } from '../repositories/example.repository';

// @Injectable()
// export class ExampleService {
//     public constructor(protected exampleRepository: ExampleRepository, protected exampleApi: ExampleGateway) {}

//     getExample(id: string) {
//         return this.exampleRepository.getEntity(id);
//     }

//     create(exampleDto: ExampleDto | DeepPartial<Example>) {
//         return this.exampleRepository.save(exampleDto);
//     }

//     getApiExample() {
//         return this.exampleApi.getExample();
//     }
// }
