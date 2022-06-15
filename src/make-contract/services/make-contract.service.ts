import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigType } from 'Config/config.module';
import { CommonGateway } from 'Global/gateways/common.gateway';
import { ContractDto, GaxProof, GaxVerifiableCredential } from 'Gateways/dtos/contract.dto';
import { ValidationException } from 'Common/exceptions/validation.exception';

@Injectable()
export class MakeContractService {
  public constructor(protected readonly configService: ConfigService<ConfigType>, protected commonApi: CommonGateway) {}

  /**
   * DCS - validates the format and content of the DASD and sign it.
   * GX-DCS then confirms the Consumer’s identity and the provided details and finalizes the Data Contract by replacing the previous GX-DCS Signature with a new version now calcu- lated over all details in the finale contract
   * - verify that users are GX participants
   * - validate the provider signature
   * - Only non-negotiable check
   * - no confirmation requirement check
   *
   * Note: utilize the API of the GX-FC to retrieve the registered Data Asset SD whenever it is necessary for the making of a contract.
   * @param contractDto
   * @returns
   */
  async create(contractDto: ContractDto) {
    const contractOffer = contractDto.VerifiableCredential.credentialSubject['gax:contractOffer'];
    const shouldLog = contractOffer['gax:loggingMode'];
    const providerDID =
      contractDto.VerifiableCredential.credentialSubject['gax:contractOffer']['gax:permission']['gax:assigner'];
    const userExists = await this.checkUser(providerDID);

    // const proofs: GaxProof[] = (<unknown>contractDto.VerifiableCredential.proof) as GaxProof[];
    // const areValidSignitures = await this.checkSignatures(proofs);
    // if (!areValidSignitures) {
    //   throw new UnauthorizedException();
    // }

    const isValidSig = await this.checkSignature(contractDto.proof);
    if (!isValidSig) {
      throw new ValidationException('Invalid signiture.', 431);
    }

    if (!userExists) {
      throw new UnauthorizedException('user');
    }

    if (this.isValidAgreementWithNegotiableFalse(contractDto.VerifiableCredential)) {
      throw new ValidationException('Negotiable must be false.', 430);
    }

    if (!this.isConfirmationRequiredFalse(contractDto.VerifiableCredential)) {
      throw new ValidationException('No confirmation should be required.', 430);
    }

    const signature = await this.addSignature();

    if (signature['example']['type'] === undefined) {
      throw new UnauthorizedException();
    }

    const proof = {
      type: signature['example']['type'],
      proofPurpose: signature['example']['proofPurpose'],
      created: new Date(),
      verificationMethod: signature['example']['verificationMethod'],
      jws: signature['example']['jws'],
    };

    contractDto.proof = proof;

    if (shouldLog === 'gax:LoggingMandatory') {
      //log
    }
    return contractDto;
  }

  /**
   *
   * @param providerDID
   * @returns
   */
  async checkUser(providerDID: string) {
    return await this.commonApi.checkUser(providerDID);
  }

  /**
   * Check provider and consumer signitures
   * @param signatures
   * @returns
   */
  async checkSignatures(signatures: GaxProof[]) {
    return await this.commonApi.checkSignatures(signatures);
  }

  /**
   * Check signiture
   * @param signature
   * @returns
   */
  async checkSignature(signature: GaxProof) {
    return await this.commonApi.checkSignature(signature);
  }

  /**
   * The GX-DCS MUST accept only Agreements that have the value false assigned to all gax:negotiable properties inside the Rules
   * @param credentials
   * @returns boolean
   */
  isValidAgreementWithNegotiableFalse(credentials: GaxVerifiableCredential) {
    return credentials.credentialSubject['gax:contractOffer']['gax:permission']['gax:negotiable'];
  }

  /**
   * In the case of making an Agreement the GX-DCS MUST accept only Agreements that have the value false assigned to the gax:confirmationRequired property.
   * @param credentials
   * @returns boolean
   */
  isConfirmationRequiredFalse(credentials: GaxVerifiableCredential) {
    if (credentials.credentialSubject['gax:contractOffer']['gax:confirmationRequired']) {
      return false;
    }
    return true;
  }

  /**
   * GX-DCS MUST sign the Agreement
   */
  async addSignature() {
    return await this.commonApi.addSignature();
  }
}
