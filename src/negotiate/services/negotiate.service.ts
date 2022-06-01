import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ContractDto, GaxPermission, GaxProof, GaxVerifiableCredential } from 'Gateways/dtos/contract.dto';
import { ConfigService } from '@nestjs/config';
import { ConfigType } from 'Config/config.module';
import { CommonGateway } from 'Global/gateways/common.gateway';
import { NegotiateGateway } from '../gateways/negotiate.gateway';

@Injectable()
export class NegotiateService {
  public constructor(
    protected negotiateApi: NegotiateGateway,
    protected readonly configService: ConfigService<ConfigType>,
    protected commonApi: CommonGateway,
  ) {}

  /**
   *
   * The GX-DCS validates the offer made by comparing it to the original DASD available in the Catalogue to ensure that only the negotiable properties were adjusted. The offer is then forwarded to the Data provider who can decide whether the offer is accepted.
   * - verify that users are GX participants (done)
   * - validate the provider and consumer signature (done)
   * - MUST accept only Agreements that have the value true assigned to one or more gax:negotiable properties inside the Rules or true assigned to the gax:confirmationRequired property.
   * - validate contract (Data Contract was valid and forwarded to the Data Provider)
   * - The Providers need to offer an endpoint (that the GX-DCS can transfer contract offers to) utilizing the property gax:hasLegallyBindingAddress in their Self Descriptions. This endpoint could be used to automatically evaluate Agreements or to establish manual Confirmation flows on the Provider side.
   * Note: 200 indicates that the Agreement has been forwarded to the Data Provider for confirmation
   * Forbidden – the “general terms” are not empty, but the requesting Participant is not a human being (this restriction might be removed in future versions)
   * @param contractDto
   */
  async create(contractDto: ContractDto) {
    const contractOffer = contractDto.VerifiableCredential.credentialSubject['gax:contractOffer'];
    const proofs: GaxProof[] = (<unknown>contractDto.VerifiableCredential.proof) as GaxProof[];
    const shouldLog = contractOffer['gax:loggingMode'];

    if (shouldLog !== 'gax:LoggingMandatory' && shouldLog !== 'gax:LoggingOptional') {
      throw new ForbiddenException();
    }

    // TODO: proof should not be array?
    // const isValidSig = await this.checkSignatures((<unknown>proofs) as GaxProof[]);
    const isValidSig = await this.checkSignature(contractDto.proof);
    if (!isValidSig) {
      throw new UnauthorizedException();
    }
    if (!this.isValidAgreementWithNegotiableTrue(contractDto.VerifiableCredential)) {
      throw new ForbiddenException();
    }

    if (!this.isValidContractWithGeneralTerms(contractDto)) {
      throw new ForbiddenException();
    }
    if (this.noConfirmationRequired(contractDto)) {
      throw new ForbiddenException();
    }

    if (!this.isNegotiationCheckOriginal(contractDto)) {
      throw new ForbiddenException();
    }

    if (!this.isPolicyConformance(contractDto)) {
      throw new ForbiddenException();
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
  // async checkSignatures(signatures: GaxProof[]) {
  //   return await this.commonApi.checkSignatures(signatures);
  // }

  /**
   * The GX-DCS MUST accept only Agreements that have the value true assigned to all gax:negotiable properties inside the Rules
   * @param credentials
   * @returns boolean
   */
  isValidAgreementWithNegotiableTrue(credentials: GaxVerifiableCredential) {
    return credentials.credentialSubject['gax:contractOffer']['gax:permission']['gax:negotiable'];
  }

  /**
   * Forbidden – the “general terms” are not empty, but the requesting Participant is not a human being
   * @param contract
   * @returns boolean
   */
  isValidContractWithGeneralTerms(contract: ContractDto) {
    if (contract.VerifiableCredential.credentialSubject['gax:contractOffer']['gax:generalTerms'] === '') {
      return false;
    }
    return true;
  }

  /**
   * Transfer Contract. This could be used to automatically evaluate Agreements or to establish manual Confirmation flows on the Provider side.
   * The Providers need to offer an endpoint (that the GX-DCS can transfer contract offers to) utilizing the property gax:hasLegallyBindingAddress in their Self Descriptions.
   * MUST forward the Agreement to the Data Provider and MUST inform the Data Consumer about it.
   * @param contract
   */
  async transferContract(contract: ContractDto) {
    if (contract) {
      await this.negotiateApi.transferContract(contract); // to Data Provider
      await this.negotiateApi.notifyConsumer(contract); // to Data Consumer
    }
  }

  /**
   * check with the Federated Catalogue if the original of the submitted Data Asset Self-Description is valid and MUST compare the original with the submitted one.
   * @param contract
   */
  async isNegotiationCheckOriginal(contract: ContractDto) {
    return await this.negotiateApi.negotiationCheckOriginal(contract);
  }

  /**
   * In the case of making an Agreement the GX-DCS MUST accept only Agreements that have the value false assigned to the gax:confirmationRequired property.
   * @param contract
   */
  noConfirmationRequired(contract: ContractDto): any {
    return contract.VerifiableCredential.credentialSubject['gax:contractOffer']['gax:confirmationRequired'];
  }

  /**
   * check if the Consumer conforms to the policies, insofar that is technically feasible with fungible effort.
   * @param contract
   */
  isPolicyConformance(contract: ContractDto): any {
    // TODO
    return true;
  }
}
