import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExampleApi } from './apis/example.api';
import { ExampleController } from './controllers/example.controller';
import { Example } from './entities/example.entity';
import { ExampleRepository } from './repositories/example.repository';
import { ExampleService } from './services/example.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Example])
    ],
    providers: [ExampleRepository, ExampleService, ExampleApi],
    controllers: [ExampleController]
})
export class ExampleModule {}
