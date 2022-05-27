import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ContractDto, GaxPermission, GaxProof } from 'Gateways/dtos/contract.dto';
import { CommonGateway } from 'Global/gateways/common.gateway';

@Injectable()
export class ValidateService {
    public constructor(protected commonApi: CommonGateway) {}

    async create(validateDto: ContractDto) {
      // differentiate negotiable / non-negotiable contract
      // negotiable - one or more field with gax:negotiable = true || gax:confirmationRequired = true
      // check provider and consumer => if non-negotiable only provider

      const contractOffer = validateDto.verifiableCredential[0].credentialSubject['gax:contractOffer'];
      const confirmationRequired = contractOffer['gax:confirmationRequired'];
      const permissions: GaxPermission[] = <unknown>contractOffer['gax:permission'] as GaxPermission[];
      const proofs = validateDto.verifiableCredential[0].proof;
      let found = confirmationRequired;

      if (found) {
        for (const permission of permissions) {
          if (permission['gax:negotiable'] === true) {
            found = true;
            break;
          }
        }

        try {
          return await this.checkSignatures(<unknown>proofs as GaxProof[]);
        } catch (e) {
          throw new UnauthorizedException();
        }
      }

      return await this.checkSignature(<unknown>proofs[1] as GaxProof);
    }

    async checkSignature(proof: GaxProof) {
      return await this.commonApi.checkSignature(proof);
    }

    async checkSignatures(signatures: GaxProof[]) {
      return await this.commonApi.checkSignatures(signatures);
    }
}
