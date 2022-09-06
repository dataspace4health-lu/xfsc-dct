import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { ConfigType } from '../../config/config.module';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter<Error> {
    public constructor(private logger: Logger, private readonly configService: ConfigService<ConfigType>) {}

    catch(exception: Error, host: ArgumentsHost){
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception instanceof HttpException ? exception.getStatus() : 500;

        this.logger.error(exception.message, exception.stack);

        if (this.configService.get('general.isDevelopment', { infer: true })) {
            response.status(status).json({
                statusCode: status,
                message: exception.message,
                stack: exception.stack,
            });
            return;
        }

        response.status(500).json({
            statusCode: status,
            message: 'Internal server error',
        });
    }
}
