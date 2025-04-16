import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';
// import { VerifiablePresentation, Arrayify } from '@gaia-x/gaia-x-vc';
import { VerifiablePresentation } from '../dtos/verifiable-presentation.dto';
import { CredentialSubject, GaxIdReference, GaxDataAccountExport } from './base.dto';
import { GaxTermsAndConditionsMetadata, GaxSOTermsAndConditions } from './policy.dto';
import {
  GaxDataResource,
  GaxServiceOfferingLabelLevel1,
  GaxServiceAccessPoint,
  GaxInstantiatedVirtualResource,
  GaxSoftwareResource,
} from './service-offering.dto';

export class DataAsset extends CredentialSubject {
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

  @IsString()
  'gx:name': string;

  @IsString()
  'gx:description': string;

  @ValidateNested()
  @Type(() => GaxServiceOfferingLabelLevel1)
  'gx:ServiceOfferingLabelLevel1': GaxServiceOfferingLabelLevel1;

  @ValidateNested()
  @Type(() => GaxDataResource)
  'gx:DataResource': GaxDataResource;

  @ValidateNested()
  @Type(() => GaxSoftwareResource)
  'gx:SoftwareResource': GaxSoftwareResource;

  @ValidateNested()
  @Type(() => GaxServiceAccessPoint)
  'gx:ServiceAccessPoint': GaxServiceAccessPoint;

  @ValidateNested()
  @Type(() => GaxInstantiatedVirtualResource)
  'gx:InstantiatedVirtualResource': GaxInstantiatedVirtualResource;

  @ValidateNested()
  @Type(() => GaxSOTermsAndConditions)
  'gx:SOTermsAndConditions': GaxSOTermsAndConditions;
}

export class GaxPermission {}

export class DataAssetPresentation extends VerifiablePresentation(CredentialSubject) {}


export function buildDataAssetFromPresentation(registerDto: DataAssetPresentation): DataAsset {
  const credentialSubject = registerDto.verifiableCredential[0].credentialSubject as CredentialSubject;
  const subjects = Array.isArray(credentialSubject) ? credentialSubject : [credentialSubject];

  // Create the result object using a copy of the first element’s properties
  const result = { ...subjects[0] };
  // Loop through the remaining elements and add them as new keys based on their type
  subjects.slice(1).forEach((item) => {
    let key = item.type;
    if (Array.isArray(key)) {
      key = key[0];
    }
    result[key] = item;
  });
  return result as DataAsset;
}
