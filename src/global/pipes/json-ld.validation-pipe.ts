import { ValidationPipe } from '@nestjs/common';
import * as jsonld from 'jsonld';
import { SetMetadata } from '@nestjs/common';
import { GaxProof, GaxVerifiableCredential } from 'Gateways/dtos/contract.dto';

export const CONTEXT_METADATA_KEY = 'jsonld';

export type JSONLDContext = {
  '@context': string | string[];
  '@id'?: string;
  '@type'?: string;
  VerifiableCredential: GaxVerifiableCredential[];
  proof: GaxProof[];
};

export function JSONLDContext(context: JSONLDContext) {
  return SetMetadata(CONTEXT_METADATA_KEY, context);
}

export class JSONLDValidationPipe extends ValidationPipe {
  async transform(value: any, metadata: any) {
    const schema = Reflect.getMetadata(CONTEXT_METADATA_KEY, metadata.metatype);

    if (schema) {
      value = await jsonld.compact(value, schema);
    }
    return super.transform(value, metadata);
  }
}
