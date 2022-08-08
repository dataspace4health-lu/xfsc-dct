import { IsOptional, IsString } from 'class-validator';
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
