import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    UseGuards,
    UseInterceptors,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { RdfInterceptor } from 'Global/interceptors/rdf.interceptor';
import { TokenAuthGuard } from 'src/auth/guards/token.guard';
import { ExampleDto } from '../dtos/example.dto';
import { PersonDto } from '../dtos/person.dto';
import { ExampleService } from '../services/example.service';
@UseGuards(TokenAuthGuard)
@Controller('example')
export class ExampleController {
    constructor(private readonly appService: ExampleService) {}

    @Get('jora')
    list() {
        return this.appService.getApiExample();
    }

    @Get(':id')
    get(@Param('id') id: string) {
        return this.appService.getExample(id);
    }

    @Post('')
    create(@Body() exampleDto: ExampleDto) {
        return this.appService.create(exampleDto);
    }

    @Post('/person')
    @UseInterceptors(RdfInterceptor)
    @UsePipes(new ValidationPipe({ transform: true }))
    async createUser(@Body() personDto: PersonDto) {
        console.log(personDto);
        return personDto;
    }

    @Get('/throttle/get')
    throttled() {
        return new Promise((res) => {
            setTimeout(() => {
                res('throttled');
            }, 3000);
        });
    }
}
