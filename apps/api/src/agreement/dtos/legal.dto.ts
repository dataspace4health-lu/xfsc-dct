import { IsString, ValidateNested } from 'class-validator';
import { CredentialSubject, GaxAddress } from './base.dto';
import { Type } from 'class-transformer';

export class LegalParticipant extends CredentialSubject {
  @IsString()
  'gx:legalName': string;

  @IsString()
  'gx:description': string;

  @IsString()
  'gx-terms-and-conditions:gaiaxTermsAndConditions': string;

  @ValidateNested()
  @Type(() => GaxAddress)
  'gx:headquarterAddress': GaxAddress;

  @ValidateNested()
  @Type(() => GaxAddress)
  'gx:legalAddress': GaxAddress;
}

export class LegalregistrationNumber extends CredentialSubject {
  @IsString()
  'gx:leiCode': string;

  @IsString()
  'gx:leiCode-countryCode': string;

  @IsString()
  'gx:leiCode-subdivisionCountryCode': string;
}
