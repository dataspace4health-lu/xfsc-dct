
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { ConfigType } from 'src/config/config.module';

@Catch(HttpException)
export class GlobalExceptionFilter implements ExceptionFilter<HttpException> {

    public constructor(private logger: Logger, private readonly configService: ConfigService<ConfigType>) { }

    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();

        this.logger.error(exception.message, exception.stack);

        if (this.configService.get('general.isDevelopment', {infer:true})) {
            return response
                .status(status)
                .json({
                    statusCode: status,
                    message: exception.message,
                    stack: exception.stack,
                });
        }

        response.status(500).json({
            statusCode: status,
            message: 'Internal server error',
        })

    }
}