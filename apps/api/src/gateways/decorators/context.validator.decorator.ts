import { SetMetadata } from '@nestjs/common';

export const CONTEXT_METADATA_KEY = 'jsonld';

export type JSONLSContextType = string | object;

export type JSONLDContextType = {
  '@context': JSONLSContextType | JSONLSContextType[];
  '@id'?: string;
  '@type'?: string;
};

export function JSONLDContext<C extends JSONLDContextType>(context: C) {
  return SetMetadata(CONTEXT_METADATA_KEY, context);
}
