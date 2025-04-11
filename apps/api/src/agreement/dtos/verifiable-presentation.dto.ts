import { Type } from 'class-transformer';
import { IsArray, IsDateString, IsNotEmpty, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
// import { Arrayify } from "../decorators/arrayify.decorator";
import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Arrayify } from '@gaia-x/gaia-x-vc';

export class Proof {
  @IsString()
  type: string;

  @IsString()
  proofPurpose: string;

  @IsDateString()
  created: string;

  @IsString()
  verificationMethod: string;

  @IsString()
  jws: string;
}

export class Proofable {
  @IsArray()
  @IsNotEmpty()
  @Type(() => Proof)
  @IsOptional()
  @ValidateNested()
  @Arrayify()
  proof: Array<Proof>;
}

export interface IVerifiableCredential<T> {
  credentialSubject: T | Array<T>;
  issuer: string;
}

export const VerifiableCredential = <T>(type: new (...args: any) => T) => {
  class AVerifiableCredential extends Proofable implements IVerifiableCredential<T> {
    @ApiProperty({
      type: type,
    })
    @IsNotEmpty()
    @Type(() => type)
    @ValidateNested()
    credentialSubject: T | Array<T>;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    issuer: string;
  }
  return AVerifiableCredential;
};

export const VerifiablePresentation = <T>(type: new (...args: any) => T) => {
  class IVerifiablePresentation extends Proofable {
    @ApiProperty({
      type: VerifiableCredential(type),
    })
    @Type(() => VerifiableCredential(type))
    @IsArray()
    @ValidateNested()
    @Arrayify()
    verifiableCredential: Array<IVerifiableCredential<T>>;
  }
  return IVerifiablePresentation;
};
