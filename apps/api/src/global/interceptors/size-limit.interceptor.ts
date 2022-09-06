
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { ConfigType } from '../../config/config.module';
import * as filesize from 'filesize';

@Injectable()
export class SizeLimitInterceptor implements NestInterceptor {

    sizeLimit: number;

    constructor(configService: ConfigService<ConfigType>) {
        this.sizeLimit = configService.get('general.requestSize', { infer: true })
    }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();
        const size = request.socket.bytesRead;

        if (size > this.sizeLimit) {
            throw new HttpException(`Payload too large – Request body exceeds ${filesize(this.sizeLimit)}`, 413);
        }

        return next.handle();
    }
}