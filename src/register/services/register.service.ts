import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterGateway } from '../gateways/register.gateway';
import { RegisterDto } from '../dtos/register.dto';

@Injectable()
export class RegisterService {
<<<<<<< HEAD
    public constructor(protected registerApi: RegisterGateway) {}
=======
    public constructor(protected commonApi: CommonGateway) {}
>>>>>>> e10bcb7 (removed registerApi no longer needed)

    create(registerDto: RegisterDto) {
      /**
       * - call to verify if user exists; jws
       * - call to verify that that the signature is correct (verificationMethod)
       * - call to request own signature to add
       * - call to return the DID to the provider
       */

      const userExists = this.checkProvider(registerDto.proof[0].jws);

      if (!userExists) {
        throw new ForbiddenException();
      }

      const isValidSig = this.checkSignature(registerDto.proof[0].verificationMethod);

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

    checkProvider(jws: string) {
        return this.registerApi.checkProvider(jws);
    }

    checkSignature(signature: string) {
      return this.registerApi.checkSignature(signature);
    }

    addSignature() {
      return this.registerApi.addSignature();
    }
}
