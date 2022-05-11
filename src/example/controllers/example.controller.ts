import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { TokenAuthGuard } from 'src/auth/guards/token.guard';
import { ExampleDto } from '../dtos/example.dto';
import { ExampleService } from '../services/example.service';

@UseGuards(TokenAuthGuard)
@Controller('example')
export class ExampleController {
  constructor(private readonly appService: ExampleService) { }

  @Get('jora')
  list() {
    return this.appService.getApiExample();
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.appService.getExample(id);
  }

  @Post()
  create(@Body() exampleDto: ExampleDto) {
    return this.appService.create(exampleDto);
  }

  @Get('/throttle/get')
  throttled() {
    return new Promise((res) => {
      setTimeout(() => {
          res('throttled');
        }
        , 3000);
    });
  }
}
