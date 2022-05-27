import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from '../dtos/register.dto';
import { CommonGateway } from '../../common/api/common.gateway';
import { GaxProof } from 'Common/dtos/contract.dto';

@Injectable()
export class RegisterService {
    public constructor(protected commonApi: CommonGateway) {}

    create(registerDto: RegisterDto) {
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

      const signature = this.addSignature();

      const proof = {
        type: 'Ed25519Signature2018',
        proofPurpose: 'assertionMethod',
        created: new Date(),
        verificationMethod: signature['verificationMethod'],
        jws: signature['jws']
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

    addSignature() {
      return this.commonApi.addSignature();
    }
}
