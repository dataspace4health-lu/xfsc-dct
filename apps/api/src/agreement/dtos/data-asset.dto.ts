import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean, IsDateString, IsNumberString,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested
} from 'class-validator';
import { VerifiablePresentation, Arrayify } from '@gaia-x/gaia-x-vc';

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

  @ValidateNested()
  @IsArray()
  @Arrayify()
  'gax:permission': GaxPermission[];
}

class GaxDistribution {
  @IsString()
  'gax:title': string;

  @IsString()
  'gax:description': string;

  @IsDateString()
  'gax:created': string;

  @IsDateString()
  'gax:modified': string;

  @IsString()
  'gax:mediaType': string;

  @IsNumberString()
  'gax:byteSize': string;

  @IsUrl()
  'gax:accessURL': string;

  @IsString()
  @IsOptional()
  'gax:hasLegallyBindingAddress': string;
}

export class DataAsset {
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
  @IsOptional()
  'gax:consumer'?: string;

  @IsString()
  'gax:creator': string;

  @IsString()
  'gax:language': string;

  @IsObject()
  @Type(() => GaxDistribution)
  @ValidateNested()
  'gax:distribution': GaxDistribution;

  @IsDateString()
  'gax:created': string;

  @IsDateString()
  'gax:modified': string;

  @IsBoolean()
  'gax:containsPersonalData': boolean;

  @IsBoolean()
  'gax:sampleAvailable': boolean;

  @IsObject()
  @Type(() => GaxContractOffer)
  @ValidateNested()
  'gax:contractOffer': GaxContractOffer;
}

export class DataAssetPresentation extends VerifiablePresentation(DataAsset) { 

  
}