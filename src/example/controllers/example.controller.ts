import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    Param,
    Post,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { TokenAuthGuard } from 'src/auth/guards/token.guard';
import { ExampleDto } from '../dtos/example.dto';
import { ExampleService } from '../services/example.service';

@Controller()
@UseGuards(TokenAuthGuard)
export class ExampleController {
    constructor(private readonly appService: ExampleService) {}

    @Get()
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
}
