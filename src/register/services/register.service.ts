import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from '../dtos/register.dto';
import { CommonGateway } from 'Global/gateways/common.gateway';
import { GaxProof } from 'Gateways/dtos/contract.dto';

@Injectable()
export class RegisterService {
    public constructor(protected commonApi: CommonGateway) {}

    async create(registerDto: RegisterDto) {
      /**
       * - call to verify if user exists; jws
       * - call to verify that that the signature is correct (verificationMethod)
       * - call to request own signature to add
       * - call to return the DID to the provider
       */

      const userExists = this.checkProvider(registerDto.proof[0]);

      if (!userExists) {
        throw new ForbiddenException();
      }

      const isValidSig = this.checkSignature(registerDto.proof[0]);

      if (!isValidSig) {
        throw new UnauthorizedException();
      }

      const signature = await this.addSignature();

      // @TODO: this should be checked when implemented with the live service
      const proof = {
        type: signature['example']['type'],
        proofPurpose: signature['example']['proofPurpose'],
        created: new Date(),
        verificationMethod: signature['example']['verificationMethod'],
        jws: signature['example']['jws']
      };

      registerDto.proof.push(proof);

      return registerDto;
    }

    checkProvider(proof: GaxProof) {
      return this.commonApi.checkProvider(proof);
    }

    checkSignature(proof: GaxProof) {
      return this.commonApi.checkSignature(proof);
    }

    async addSignature() {
      return await this.commonApi.addSignature();
    }
}
