import { IsString, ValidateNested, IsObject, IsUrl, IsBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { CredentialSubject, GaxIdReference, GaxDataAccountExport } from './base.dto';
import { GaxTermsAndConditionsMetadata } from './policy.dto';

export class GaxServiceOfferingLabelLevel1 extends CredentialSubject {
  @ValidateNested()
  @Type(() => GaxIdReference)
  'gx:assignedTo': GaxIdReference;

  // @ValidateNested()
  @IsObject()
  // @Type(() => GaxServiceOfferingCriteria)
  'gx:criteria': object; // Specify the type for gx:criteria
}

export class GaxDataResource extends CredentialSubject {
  @IsString()
  'gx:name': string;

  @ValidateNested()
  @Type(() => GaxIdReference)
  'gx:exposedThrough': GaxIdReference;

  @IsString()
  'gx:policy': string;

  @IsString()
  'gx:license': string;

  @IsString()
  'gx:copyrightOwnedBy': string;

  @ValidateNested()
  @Type(() => GaxIdReference)
  'gx:producedBy': GaxIdReference;

  @IsString()
  @IsOptional()
  'gx:obsoleteDateTime': string;

  @IsString()
  @IsOptional()
  'gx:expirationDateTime': string;

  // Transform string "true"/"false" into a boolean.
  @IsBoolean()
  'gx:containsPII': boolean;
}

export class GaxServiceAccessPoint extends CredentialSubject {
  @IsString()
  'gx:name': string;

  @IsString()
  'gx:host': string;

  @IsString()
  'gx:protocol': string;

  @IsString()
  'gx:version': string;

  @IsString()
  'gx:port': string;

  @IsUrl()
  'gx:openAPI': string;
}

export class GaxInstantiatedVirtualResource extends CredentialSubject {
  @ValidateNested()
  @Type(() => GaxIdReference)
  'gx:hostedOn': GaxIdReference;

  @ValidateNested()
  @Type(() => GaxIdReference)
  'gx:instanceOf': GaxIdReference;

  @ValidateNested()
  @Type(() => GaxIdReference)
  'gx:serviceAccessPoint': GaxIdReference;

  @ValidateNested()
  @Type(() => GaxIdReference)
  'gx:maintainedBy': GaxIdReference;

  @ValidateNested()
  @Type(() => GaxIdReference)
  'gx:tenantOwnedBy': GaxIdReference;
}

export class GaxSoftwareResource extends CredentialSubject {
  @IsString()
  'gx:name': string;

  @IsString()
  'gx:description': string;

  @IsString()
  'gx:policy': string;

  @IsString()
  'gx:license': string;

  @IsString()
  'gx:copyrightOwnedBy': string;
}

export class ServiceOffering extends CredentialSubject {
  @IsString()
  'gx:name': string;

  @IsString()
  'gx:description': string;

  @ValidateNested()
  @Type(() => GaxIdReference)
  'gx:providedBy': GaxIdReference;

  @ValidateNested()
  @Type(() => GaxTermsAndConditionsMetadata)
  'gx:termsAndConditions': GaxTermsAndConditionsMetadata;

  @IsString()
  'gx:policy': string;

  @IsString()
  'gx:dataProtectionRegime': string;

  @ValidateNested()
  @Type(() => GaxDataAccountExport)
  'gx:dataAccountExport': GaxDataAccountExport;
}
