import { Controller, Get } from '@nestjs/common';
import { ExampleService } from '../services/example.service';

@Controller()
export class ExampleController {
  constructor(private readonly appService: ExampleService) {}

  @Get()
  list() {
    return this.appService.getExample();
  }
}
