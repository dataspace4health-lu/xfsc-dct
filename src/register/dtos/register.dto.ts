import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsDate, IsNotEmpty, IsNumber, IsObject, IsString, IsUrl } from 'class-validator';
import { Url } from 'jsonld/jsonld-spec';
import { JSONLDContext } from '../decorators/context.validator.decorator';

@JSONLDContext({ '@context': 'https://json-ld.org/contexts/person.jsonld' })
export class RegisterDto {
  @IsArray()
  '@context': Url[]

  @IsString()
  type: string;

  @IsArray()
  @Type(() => GaxVerifiableCredential)
  verifiableCredential: GaxVerifiableCredential[];

  @IsArray()
  @Type(() => GaxProof)
  proof: GaxProof[];
}

class GaxVerifiableCredential {
  @IsObject()
  @IsNotEmpty()
  @Type(() => CredentialSubject)
  credentialSubject: CredentialSubject;
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

  @IsNumber()
  'gax:publisher': number;

  @IsNumber()
  'gax:creator': number;

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

class GaxPermission {
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

class GaxPostDuty {
  @IsString()
  '@type': string;

  @IsString()
  @Type(() => GaxAction)
  'gax:action': GaxAction;
}

class GaxAction {
  @IsString()
  '@id': string;
}

class GaxProof {
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