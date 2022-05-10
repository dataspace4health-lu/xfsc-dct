import { ConsoleLogger, Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { ConfigType } from 'src/config/config.module';
import * as Winston from 'winston';

export enum LoggerType {
    Console = 'console',
    WINSTON = 'winston',
}

@Injectable()
export class LoggerProvider {
    public logger: LoggerService;

    public constructor(readonly configService: ConfigService<ConfigType>) {
        if (configService.get('logger.type', { infer: true }) === LoggerType.WINSTON) {
            let transports = [];
            const { winston } = configService.get('logger');
            if (winston.isConsole || configService.get('general.isDevelopment', { infer: true })) {
                transports.push(
                    new Winston.transports.Console({
                        format: Winston.format.simple(),
                    }),
                );
            }
            if (winston.fileName) {
                transports.push(
                    new Winston.transports.File({
                        filename: winston.fileName,
                        format: Winston.format.simple(),
                    }),
                );
            }
            const level = configService.get('logger.winston.level', { infer: true });
            this.logger = WinstonModule.createLogger({
                level,
                format: Winston.format.simple(),
                transports,
            });
        } else {
            this.logger = new ConsoleLogger();
        }
    }
}
