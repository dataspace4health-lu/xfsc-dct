import { Logger, Module } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
import { GlobalExceptionFilter } from "./exceptions/global.exception-filter";
import { LoggerProvider } from "./logs/logger.provider";

@Module({
    providers: [
        {
            provide: APP_FILTER,
            useClass: GlobalExceptionFilter,
        },
        LoggerProvider,
        Logger
    ]
})
export class GlobalModule { }