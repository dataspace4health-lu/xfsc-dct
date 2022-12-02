import { ValidationPipe } from '@nestjs/common';
import * as jsonld from 'jsonld';

export const CONTEXT_METADATA_KEY = 'jsonld';

export class JSONLDValidationPipe extends ValidationPipe {
  async transform(value: any, metadata: any) {
    const schema = Reflect.getMetadata(CONTEXT_METADATA_KEY, metadata.metatype);

    if (schema) {
      value = await jsonld.compact(value, schema);
    }
    return super.transform(value, metadata);
  }
}
