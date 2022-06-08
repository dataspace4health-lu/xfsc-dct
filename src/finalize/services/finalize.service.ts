import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigType } from 'Config/config.module';
import { ContractDto, GaxProof } from 'Gateways/dtos/contract.dto';
import { CommonGateway } from 'Global/gateways/common.gateway';
@Injectable()
export class FinalizeService {
  public constructor(protected readonly configService: ConfigService<ConfigType>, protected commonApi: CommonGateway) {}

  /**
   *
   * - Finalization Provider authorization (GX partipipants)
   * - Finalize content validation
   * - Finalize signature validation: To finalize an Agreement, the GX-DCS MUST first validate, that the signatures of both the Data Provider and the Data Consumer are valid.
   * - Finalization approval: MUST sign the Agreement while including the signatures of Data Provider and Data Consumer in the hash
   * - Finalization distribution: return contract in response
   * @param contractDto
   */
  async create(contractDto: ContractDto) {
    const proofs: GaxProof[] = (<unknown>contractDto.VerifiableCredential.proof) as GaxProof[];
    const providerDID =
      contractDto.VerifiableCredential.credentialSubject['gax:contractOffer']['gax:permission']['gax:assigner'];
    const validSD = await this.checkSD(providerDID, contractDto);
    const userExists = await this.checkUser(providerDID);

    const isValidProviderSig = await this.checkSignature(proofs[0]);
    const isValidConsumerSig = await this.checkSignature(proofs[1]);

    if (!isValidProviderSig && !isValidConsumerSig && !validSD && !userExists) {
      throw new UnauthorizedException();
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

    const hasLegallyBindingAddress =
      contractDto.VerifiableCredential.credentialSubject['gax:distribution']['gax:hasLegallyBindingAddress'];
    if (hasLegallyBindingAddress) {
      this.transferContractOffer(hasLegallyBindingAddress);
    }

    return contractDto;
  }

  /**
   * Check provider and consumer signitures
   * @param signatures
   * @returns
   */
  async checkSignature(signature: GaxProof) {
    return await this.commonApi.checkSignature(signature);
  }

  /**
   * GX-DCS MUST sign the Agreement using a hash including the Data Provider signature and Data Consumer signature. Then it MUST be sent to both Data Provider and Data Consumer.
   */
  async addSignature() {
    return await this.commonApi.addSignature();
  }

  /**
   * Validate SD
   * @param providerDID
   * @param document
   * @returns
   */
  async checkSD(providerDID: string, document: ContractDto) {
    return await this.commonApi.checkSD(providerDID, document);
  }

  /**
   * Check GX partipipants
   * @param providerDID
   * @returns
   */
  async checkUser(providerDID: string) {
    return await this.commonApi.checkUser(providerDID);
  }

  /**
   * The Providers need to offer an endpoint (that the GX-DCS can transfer contract offers to) utilizing the property gax:hasLegallyBindingAddress in their Self Descriptions. This endpoint could be used to automatically evaluate Agreements or to establish manual Confirmation flows on the Provider side
   * @param hasLegallyBindingAddress
   * @returns
   */
  async transferContractOffer(hasLegallyBindingAddress: string) {
    return await this.commonApi.transferContractOffer(hasLegallyBindingAddress);
  }
}
