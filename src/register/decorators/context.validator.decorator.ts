import { SetMetadata } from '@nestjs/common';
import { RegisterDto } from 'Register/dtos/register.dto';

export const CONTEXT_METADATA_KEY = 'jsonld';

export type JSONLDContext = RegisterDto;
// {
//     '@context': string | string[];
//     // '@id'?: string;
//     'type'?: string;
//     '@verifiableCredential': RegisterDto;
//     // '@proof': Object;
// };

export function JSONLDContext(context: JSONLDContext) {
    return SetMetadata(CONTEXT_METADATA_KEY, context);
}
