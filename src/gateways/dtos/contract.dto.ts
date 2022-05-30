import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsDate, IsNotEmpty, IsNumber, IsObject, IsString, IsUrl } from 'class-validator';
import { Url } from 'jsonld/jsonld-spec';
import { JSONLDContext } from 'src/gateways/decorators/context.validator.decorator';

// @JSONLDContext({ '@context': 'https://json-ld.org/contexts/person.jsonld' })
export class ContractDto {
  @IsArray()
  @Type(() => GaxVerifiableCredential)
  verifiableCredential: GaxVerifiableCredential[];

  @IsArray()
  @Type(() => GaxProof)
  proof: GaxProof[];
}

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
  'gax:accessURL': Url;
}

class CredentialSubject {
  @IsUrl()
  '@id': Url;

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
  'gax:language': Url;

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

class GaxVerifiableCredential {
  @IsObject()
  @IsNotEmpty()
  @Type(() => CredentialSubject)
  credentialSubject: CredentialSubject;

  @IsArray()
  @IsNotEmpty()
  @Type(() => GaxProof)
  proof: GaxProof;
}
