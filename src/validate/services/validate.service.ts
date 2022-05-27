import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ValidateGateway } from '../gateways/validate.gateway';
import { ContractDto, GaxPermission, GaxProof } from 'Gateways/dtos/contract.dto';
import { CommonGateway } from 'Global/gateways/common.gateway';

@Injectable()
export class ValidateService {
    public constructor(protected validateApi: ValidateGateway, protected commonApi: CommonGateway) {}

    create(validateDto: ContractDto) {
      // differentiate negotiable / non-negotiable contract
      // negotiable - one or more field with gax:negotiable = true || gax:confirmationRequired = true
      // check provider and consumer => if non-negotiable only provider

      const contractOffer = validateDto.verifiableCredential[0].credentialSubject['gax:contractOffer'];
      const confirmationRequired = contractOffer['gax:confirmationRequired'];
      const permissions: GaxPermission[] = [contractOffer['gax:permission']];
      let found = confirmationRequired;

      if (!found) {
        permissions.forEach((permission) => {
          if (permission['gax:negotiable'] === true) {
            found = true;
            try {
              return this.checkSignatures(validateDto.proof);
            } catch (e) {
              throw new UnauthorizedException();
            }
          }
        });
      }

      return this.checkProvider(validateDto.proof[0]);
    }

    checkProvider(proof: GaxProof) {
      return this.commonApi.checkProvider(proof);
    }

    checkSignatures(signatures: GaxProof[]) {
      return this.commonApi.checkSignatures(signatures);
    }
}
