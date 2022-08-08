import { SetMetadata } from '@nestjs/common';

export const CONTEXT_METADATA_KEY = 'jsonld';

export type JSONLDContext = {
  '@context': string | string[];
  '@id'?: string;
  '@type'?: string;
  'verifiableCredential': object | object[];
  'proof': object | object[];
};

export function JSONLDContext(context: JSONLDContext) {
  return SetMetadata(CONTEXT_METADATA_KEY, context);
}
