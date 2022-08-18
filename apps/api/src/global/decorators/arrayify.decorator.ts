import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';

export function Arrayify() {
  return applyDecorators(
    Transform(({value}: any) => Array.isArray(value) ? value : [value], { toClassOnly: true }),
  );
}