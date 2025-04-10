import { IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CredentialSubject } from './base.dto';

export class GaxTermsAndConditionsMetadata {
  @IsString()
  'gx:URL': string;

  @IsString()
  'gx:hash': string;
}

export class GaxSOTermsAndConditions {
  @ValidateNested()
  @Type(() => GaxTermsAndConditionsMetadata)
  'gx:URL': GaxTermsAndConditionsMetadata;
}

export class GaxTermsAndConditions extends CredentialSubject {
  @IsString()
  'gx:termsAndConditions': string;
}
