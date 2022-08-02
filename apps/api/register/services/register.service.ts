import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CommonGateway } from 'Global/gateways/common.gateway';
import { ContractDto, GaxProof } from 'Gateways/dtos/contract.dto';
@Injectable()
export class RegisterService {
  public constructor(protected commonApi: CommonGateway) { }

  async create(registerDto: ContractDto) {
    const providerDID = registerDto.VerifiableCredential.credentialSubject['gax:contractOffer']['gax:permission']['gax:assigner'];
    const validSD = await this.checkSD(registerDto);
    const userExists = await this.checkUser(providerDID);
    const isValidSig = await this.checkSignature(registerDto.proof);

    if (!userExists['isValid'] && !isValidSig && !validSD) {
      throw new ForbiddenException();
    }

    const signature = await this.addSignature();

    if (signature['example']['type'] === undefined) {
      throw new UnauthorizedException();
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

    (<unknown>registerDto.proof as GaxProof[]) = proofs;

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
