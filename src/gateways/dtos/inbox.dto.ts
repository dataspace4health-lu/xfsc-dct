import { IsOptional, IsString } from 'class-validator';
import { JSONLDContext } from 'src/gateways/decorators/context.validator.decorator';

export class InboxDto {
  @IsString()
  @IsOptional()
  '@context': string;

  @IsString()
  @IsOptional()
  '@id': string;

  @IsString()
  @IsOptional()
  'inbox': string;
}
