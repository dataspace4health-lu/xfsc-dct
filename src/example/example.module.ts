import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
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
    providers: [ExampleRepository, ExampleService, ExampleApi, {
        provide: APP_GUARD,
        useClass: ThrottlerGuard
    },],
    controllers: [ExampleController]
})
export class ExampleModule { }
