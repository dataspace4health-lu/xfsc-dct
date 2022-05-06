import { Controller, Get, UseGuards } from '@nestjs/common';
import { TokenAuthGuard } from 'src/auth/guards/token.guard';
import { ExampleService } from '../services/example.service';

@Controller()
@UseGuards(TokenAuthGuard)
export class ExampleController {
  constructor(private readonly appService: ExampleService) {}

  @Get()
  list() {
    return this.appService.getExample();
  }
}
