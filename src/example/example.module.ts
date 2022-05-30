// import { Module } from '@nestjs/common';
// import { APP_GUARD } from '@nestjs/core';
// import { ThrottlerGuard } from '@nestjs/throttler';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { ExampleGateway } from './gateways/example.gateway';
// import { ExampleController } from './controllers/example.controller';
// import { Example } from './entities/example.entity';
// import { ExampleRepository } from './repositories/example.repository';
// import { ExampleService } from './services/example.service';

// @Module({
//     imports: [TypeOrmModule.forFeature([Example])],

//     providers: [
//         ExampleRepository,
//         ExampleService,
//         ExampleGateway,
//         {
//             provide: APP_GUARD,
//             useClass: ThrottlerGuard,
//         },
//     ],
//     controllers: [ExampleController],
// })
// export class ExampleModule {}
