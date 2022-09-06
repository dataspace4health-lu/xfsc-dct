import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
export class InboxDto {
  @IsString()
  @IsOptional()
  '@context': string;

  @IsString()
  @IsOptional()
  @Expose({
    
  })
  '@id': string;

  @IsString()
  @IsOptional()
  'inbox': string;

  @IsString()
  @IsOptional()
  'link': string;

  @IsString()
  @IsOptional()
  'rel': string;
}
