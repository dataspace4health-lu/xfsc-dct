import {
    BadRequestException,
    CallHandler,
    ExecutionContext,
    NestInterceptor
} from '@nestjs/common';
import rdfParser from 'rdf-parse';
import rdfSerializer from 'rdf-serialize';
import { map } from 'rxjs';
import { Readable } from 'stream';
import * as streamToString from 'stream-to-string';

export class RdfInterceptor implements NestInterceptor {
    async intercept(context: ExecutionContext, next: CallHandler<any>) {
        const request = context.switchToHttp().getRequest();
        const responseType =
            !request.headers['accept'] || request.headers['accept'] === '*/*'
                ? 'application/ld+json'
                : request.headers['accept'];

        const types = await rdfSerializer.getContentTypes();
        if (!types.includes(responseType)) {
            throw new BadRequestException(`Unsupported "Accept" content type. Supported types: ${types.join(', ')}`);
        }

        return next.handle().pipe(
            map((data) => {
                if ('application/ld+json' !== responseType) {
                    const quadsStream = rdfParser.parse(Readable.from(JSON.stringify(data)), {
                        contentType: 'application/ld+json',
                    });
                    const jsonLDStream = rdfSerializer.serialize(quadsStream, { contentType: responseType });
                    return streamToString(jsonLDStream);
                }
                return data;
            }),
        );
    }
}
