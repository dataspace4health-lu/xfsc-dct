import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CommonGateway } from 'Global/gateways/common.gateway';
import { ContractDto, GaxPermission, GaxProof } from 'Gateways/dtos/contract.dto';

@Injectable()
export class ValidateService {
  public constructor(protected commonApi: CommonGateway) {}

  async create(validateDto: ContractDto) {
    // differentiate negotiable / non-negotiable contract
    // negotiable - one or more field with gax:negotiable = true || gax:confirmationRequired = true
    // check provider and consumer => if non-negotiable only provider

    const contractOffer = validateDto.VerifiableCredential.credentialSubject['gax:contractOffer'];
    const confirmationRequired = contractOffer['gax:confirmationRequired'];
    const providerDID = contractOffer['gax:permission'][0]['gax:assigner'];
    const permissions: GaxPermission[] = (<unknown>contractOffer['gax:permission']) as GaxPermission[];
    const proofs = validateDto.VerifiableCredential.proof;
    let found = confirmationRequired;

    const validSD = await this.checkSD(providerDID, validateDto);

    if (!found) {
      for (const permission of permissions) {
        if (permission['gax:negotiable'] === true) {
          found = true;
          break;
        }
      }
    }

    if (found) {
      try {
        return await this.checkSignatures((<unknown>proofs) as GaxProof[]);
      } catch (e) {
        throw new UnauthorizedException();
      }
    } else {
      return await this.checkSignature((<unknown>proofs[1]) as GaxProof);
    }
  }

  async checkSignature(proof: GaxProof) {
    return await this.commonApi.checkSignature(proof);
  }

  async checkSignatures(signatures: GaxProof[]) {
    return await this.commonApi.checkSignatures(signatures);
  }

  async checkSD(providerDID: string, document: ContractDto) {
    return await this.commonApi.checkSD(providerDID, document);
  }
}
