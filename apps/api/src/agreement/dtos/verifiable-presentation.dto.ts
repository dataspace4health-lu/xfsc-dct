import { Type } from "class-transformer";
import { IsArray, IsDateString, IsNotEmpty, IsObject, IsOptional, IsString, ValidateNested } from "class-validator";
import { Arrayify } from "../../global/decorators/arrayify.decorator";

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

export interface IVerifiableCredential<T>{
    credentialSubject: T;
    issuer: string;
}

const VerifiableCredential = <T>(type: new (...args: any) => T) => {
    class AVerifiableCredential extends Proofable implements IVerifiableCredential<T> {
        @IsObject()
        @IsNotEmpty()
        @Type(() => type)
        @ValidateNested()
        credentialSubject: T;

        @IsString()
        @IsNotEmpty()
        issuer: string;
    }
    return AVerifiableCredential
}


export const VerifiablePresentation = <T>(type: new (...args: any) => T) => {
    class AVerifiablePresentation extends Proofable {
        @Type(() => VerifiableCredential(type))
        @IsArray()
        @ValidateNested()
        @Arrayify()
        verifiableCredential: Array<IVerifiableCredential<T>>;
    }
    return AVerifiablePresentation
}