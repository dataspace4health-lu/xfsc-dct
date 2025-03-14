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
  'gx:action': GaxAction;
}

export class GaxPermission {
  @IsString()
  '@type': string;

  @IsString()
  'gx:assigner': string;

  @IsString()
  'gx:target': string;

  @IsString()
  'gx:action': string;

  @IsBoolean()
  'gx:negotiable': boolean;

  @IsObject()
  @Type(() => GaxPostDuty)
  'gx:postDuty': GaxPostDuty;
}

class GaxContractOffer {
  @IsString()
  '@type': string;

  @IsString()
  'gx:choiceOfLaw': string;

  @IsString()
  'gx:generalTerms': string;

  @IsBoolean()
  'gx:confirmationRequired': boolean;

  @IsString()
  'gx:loggingMode': string;

  @IsString()
  'gx:circulationDetails': string;

  @ValidateNested()
  @IsArray()
  @Arrayify()
  'gx:permission': GaxPermission[];
}

class GaxDistribution {
  @IsString()
  'gx:title': string;

  @IsString()
  'gx:description': string;

  @IsDateString()
  'gx:created': string;

  @IsDateString()
  'gx:modified': string;

  @IsString()
  'gx:mediaType': string;

  @IsNumberString()
  'gx:byteSize': string;

  @IsUrl()
  'gx:accessURL': string;

  @IsString()
  @IsOptional()
  'gx:hasLegallyBindingAddress': string;
}

export class DataAsset {
  @IsUrl()
  '@id': string;

  @IsString()
  '@type': string;

  @IsString()
  'gx:title': string;

  @IsString()
  'gx:description': string;

  @IsArray()
  'gx:keyword': string[];

  @IsArray()
  'gx:category': string[];

  @IsString()
  'gx:publisher': string;

  @IsString()
  @IsOptional()
  'gx:consumer'?: string;

  @IsString()
  'gx:creator': string;

  @IsString()
  'gx:language': string;

  @IsObject()
  @Type(() => GaxDistribution)
  @ValidateNested()
  'gx:distribution': GaxDistribution;

  @IsDateString()
  'gx:created': string;

  @IsDateString()
  'gx:modified': string;

  @IsBoolean()
  'gx:containsPersonalData': boolean;

  @IsBoolean()
  'gx:sampleAvailable': boolean;

  @IsObject()
  @Type(() => GaxContractOffer)
  @ValidateNested()
  'gx:contractOffer': GaxContractOffer;
}

export class DataAssetPresentation extends VerifiablePresentation(DataAsset) { 

  
}