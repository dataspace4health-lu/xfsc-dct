
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger, Inject, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { ConfigType } from 'src/config/config.module';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter<BadRequestException> {

    public constructor(private logger: Logger, private readonly configService: ConfigService<ConfigType>) { }

    catch(exception: BadRequestException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        
        response.status(exception.getStatus()).json(exception.getResponse())

    }
}