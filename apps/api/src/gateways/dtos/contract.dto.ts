import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { JSONLDContext } from '../decorators/context.validator.decorator';

class GaxAction {
  @IsString()
  '@id': string;
}

class GaxPostDuty {
  @IsString()
  '@type': string;

  @IsString()
  @Type(() => GaxAction)
  'gax:action': GaxAction;
}

export class GaxPermission {
  @IsString()
  '@type': string;

  @IsString()
  'gax:assigner': string;

  @IsString()
  'gax:target': string;

  @IsString()
  'gax:action': string;

  @IsBoolean()
  'gax:negotiable': boolean;

  @IsObject()
  @Type(() => GaxPostDuty)
  'gax:postDuty': GaxPostDuty;
}

class GaxContractOffer {
  @IsString()
  '@type': string;

  @IsString()
  'gax:choiceOfLaw': string;

  @IsString()
  'gax:generalTerms': string;

  @IsBoolean()
  'gax:confirmationRequired': boolean;

  @IsString()
  'gax:loggingMode': string;

  @IsString()
  'gax:circulationDetails': string;

  @IsObject()
  @Type(() => GaxPermission)
  'gax:permission': GaxPermission;
}

class GaxDistribution {
  @IsString()
  'gax:title': string;

  @IsString()
  'gax:description': string;

  @IsDate()
  'gax:created': Date;

  @IsDate()
  'gax:modified': Date;

  @IsString()
  'gax:mediaType': string;

  @IsNumber()
  'gax:bytesize': number;

  @IsUrl()
  'gax:accessURL': string;

  @IsString()
  @IsOptional()
  'gax:hasLegallyBindingAddress': string;
}

class CredentialSubject {
  @IsUrl()
  '@id': string;

  @IsString()
  '@type': string;

  @IsString()
  'gax:title': string;

  @IsString()
  'gax:description': string;

  @IsArray()
  'gax:keyword': string[];

  @IsArray()
  'gax:category': string[];

  @IsString()
  'gax:publisher': string;

  @IsString()
  'gax:creator': string;

  @IsString()
  'gax:language': string;

  @IsObject()
  @Type(() => GaxDistribution)
  'gax:distribution': GaxDistribution;

  @IsDate()
  'gax:created': Date;

  @IsDate()
  'gax:modified': Date;

  @IsBoolean()
  'gax:containsPersonalData': boolean;

  @IsBoolean()
  'gax:sampleAvailable': boolean;

  @IsObject()
  @Type(() => GaxContractOffer)
  'gax:contractOffer': GaxContractOffer;
}

export class GaxProof {
  @IsString()
  type: string;

  @IsString()
  proofPurpose: string;

  @IsDate()
  created: Date;

  @IsString()
  verificationMethod: string;

  @IsString()
  jws: string;
}

export class GaxVerifiableCredential {
  @IsObject()
  @IsNotEmpty()
  @Type(() => CredentialSubject)
  credentialSubject: CredentialSubject;

  @IsArray()
  @IsNotEmpty()
  @Type(() => GaxProof)
  proof: GaxProof;
}

@JSONLDContext({ '@context': 'https://www.w3.org/2018/credentials/v1', verifiableCredential: [], proof: [] })
export class ContractDto {
  @IsObject()
  @Type(() => GaxVerifiableCredential)
  VerifiableCredential: GaxVerifiableCredential;

  @IsObject()
  @Type(() => GaxProof)
  @IsOptional()
  proof: GaxProof;
}
