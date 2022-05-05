import { Injectable } from '@nestjs/common';
import { ExampleRepository } from '../repositories/example.repository';

@Injectable()
export class ExampleService {

  public constructor(protected exampleRepository: ExampleRepository) {}

  getExample() {
    return this.exampleRepository.getEntity('asd');
  }
}
