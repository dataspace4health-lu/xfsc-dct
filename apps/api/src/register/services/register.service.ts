import { Injectable } from '@nestjs/common';
import { UnauthorizedException } from '../../common/exceptions/unauthorized.exception';
import { ContractDto, GaxProof } from '../../gateways/dtos/contract.dto';
import { CommonGateway } from '../../global/gateways/common.gateway';
@Injectable()
export class RegisterService {
  public constructor(protected commonApi: CommonGateway) {}

  async create(registerDto: ContractDto) {
    const providerDID =
      registerDto.VerifiableCredential.credentialSubject['gax:contractOffer']['gax:permission']['gax:assigner'];
    const validSD = await this.checkSD(registerDto);
    const userExists = await this.checkUser(providerDID);
    const isValidSig = await this.checkSignature(registerDto.proof);

    if (!userExists['isValid'] && !isValidSig && !validSD) {
      throw new UnauthorizedException('Data Provider DID or Data Consumer DID could not be resolved.');
    }

    const signature = await this.addSignature();

    if (signature['example']['type'] === undefined) {
      throw new UnauthorizedException('Invalid Signiture.');
    }

    // @TODO: this should be checked when implemented with the live service
    // seems to be a problem with the contract model
    const proof = {
      type: signature['example']['type'],
      proofPurpose: signature['example']['proofPurpose'],
      created: new Date(),
      verificationMethod: signature['example']['verificationMethod'],
      jws: signature['example']['jws'],
    };

    const proofs: GaxProof[] = [registerDto.proof];
    proofs.push(proof);

    ((<unknown>registerDto.proof) as GaxProof[]) = proofs;

    return registerDto;
  }

  async checkSD(document: ContractDto) {
    return await this.commonApi.checkSD(document);
  }

  async checkUser(providerDID: string) {
    return await this.commonApi.checkUser(providerDID);
  }

  async checkSignature(proof: GaxProof) {
    return await this.commonApi.checkSignature(proof);
  }

  async addSignature() {
    return await this.commonApi.addSignature();
  }
}
