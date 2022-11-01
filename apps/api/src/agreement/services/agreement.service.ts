import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ValidationException } from '../../common/exceptions/validation.exception';
import { ConfigType } from '../../config/config.module';
import { AbstractFederatedCatalogAdapter } from '../adapters';
import { DataAsset, DataAssetPresentation, GaxPermission } from '../dtos/data-asset.dto';
import { AgreementSignatureService } from './agreement-signature.service';
import { AgreementValidationService } from './agreement-validation.service';
import { LogTokenService } from './log-token.service';

export enum ParticipantType {
  PROVIDER = 'provider',
  CONSUMER = 'consumer',
}

@Injectable()
export class AgreementService {
  constructor(
    private readonly validateService: AgreementValidationService,
    private readonly signatureService: AgreementSignatureService,
    private readonly configService: ConfigService<ConfigType>,
    private readonly logTokenService: LogTokenService,
    private readonly federatedCatalogAdapter: AbstractFederatedCatalogAdapter,
  ) { }

  /**
   * Register contract API
   * - verify that users are GX Participants before allowing them to register a Data Asset.
   * - check the properties named gax:negotiable to true in each Rule that contains a placeholder.
   * - check with the GX-FC if the Self-Description is formally correct.
   * @param registerDto
   * @returns
   */
  async register(registerDto: DataAssetPresentation) {
    const dataAsset = registerDto.verifiableCredential[0].credentialSubject;
    await this.validateService.assertParticipant(dataAsset, ParticipantType.PROVIDER);
    await this.signatureService.validateSignature(registerDto, ParticipantType.PROVIDER);
    await this.validateService.assertDataAsset(dataAsset);
    return this.signatureService.sign(registerDto);
  }

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
  async makeContract(makeContractDto: DataAssetPresentation) {
    const dataAsset = makeContractDto.verifiableCredential[0].credentialSubject;
    await this.validateService.assertParticipant(dataAsset, ParticipantType.CONSUMER);
    if (this.isNegotiable(dataAsset)) {
      throw new ValidationException('Data Asset is negotiable', 400);
    }
    if (this.isConfirmationRequired(dataAsset)) {
      throw new ValidationException('Confirmation is required', 500);
    }
    if (!this.isGeneralTermsEmpty(dataAsset)) {
      throw new ValidationException(
        'Forbidden – the “general terms” are not empty, but the requesting Participant is not a human being',
        403,
      );
    }

    await this.signatureService.validateSignature(makeContractDto, ParticipantType.CONSUMER);
    await this.signatureService.validateSignature(makeContractDto, ParticipantType.PROVIDER);
    await this.validateService.assertDataAsset(dataAsset);
    const signedDataAsset = await this.signatureService.sign(makeContractDto);
    await this.sendDataAsset(signedDataAsset, ParticipantType.PROVIDER);

    return signedDataAsset;
  }

  /**
   *
   * The GX-DCS validates the offer made by comparing it to the original DASD available in the Catalogue to ensure that only the negotiable properties were adjusted. The offer is then forwarded to the Data provider who can decide whether the offer is accepted.
   * - verify that users are GX participants
   * - validate the provider and consumer signature
   * - MUST accept only Agreements that have the value true assigned to one or more gax:negotiable properties inside the Rules or true assigned to the gax:confirmationRequired property.
   * - validate contract (Data Contract was valid and forwarded to the Data Provider)
   * - The Providers need to offer an endpoint (that the GX-DCS can transfer contract offers to) utilizing the property gax:hasLegallyBindingAddress in their Self Descriptions. This endpoint could be used to automatically evaluate Agreements or to establish manual Confirmation flows on the Provider side.
   * Note: 200 indicates that the Agreement has been forwarded to the Data Provider for confirmation
   * Forbidden – the “general terms” are not empty, but the requesting Participant is not a human being (this restriction might be removed in future versions)
   * @param contractDto
   */
  async negotiate(negotiateDto: DataAssetPresentation) {
    const dataAsset = negotiateDto.verifiableCredential[0].credentialSubject;
    await this.validateService.assertParticipant(dataAsset, ParticipantType.CONSUMER);
    // move to adapter
    if (!this.isNegotiable(dataAsset)) {
      throw new HttpException('Data Asset is not negotiable', 430);
    }
    if (!this.isConfirmationRequired(dataAsset)) {
      throw new ValidationException('Data Asset should have confirmation required', 430);
    }
    if (!this.federatedCatalogAdapter.isConsumerConformPolicies(dataAsset)) {
      // what should we check here? souldn't be enoght the signiture validation for consumer
      throw new ValidationException('Forbidden – the requesting Participant is not conform to the policies', 403);
    }
    if (!this.isGeneralTermsEmpty(dataAsset)) {
      throw new ValidationException(
        'Forbidden – the “general terms” are not empty, but the requesting Participant is not a human being',
        403,
      );
    }
    await this.signatureService.validateSignature(negotiateDto, ParticipantType.CONSUMER);
    await this.validateService.assertDataAsset(dataAsset);
    await this.sendDataAsset(negotiateDto, ParticipantType.PROVIDER);
    return negotiateDto;
  }

  /**
   *
   * - Finalization Provider authorization (GX partipipants)
   * - Finalize content validation
   * - Finalize signature validation: To finalize an Agreement, the GX-DCS MUST first validate, that the signatures of both the Data Provider and the Data Consumer are valid.
   * - Finalization approval: MUST sign the Agreement while including the signatures of Data Provider and Data Consumer in the hash
   * - Finalization distribution: return contract in response
   * @param contractDto
   */
  async finalize(finalizeDto: DataAssetPresentation) {
    const dataAsset = finalizeDto.verifiableCredential[0].credentialSubject;
    await this.validateService.assertParticipant(dataAsset, ParticipantType.PROVIDER);
    await this.validateService.assertDataAsset(dataAsset);
    await this.signatureService.validateSignature(finalizeDto, ParticipantType.PROVIDER);
    await this.signatureService.validateSignature(finalizeDto, ParticipantType.CONSUMER);
    const signedDataAsset = await this.signatureService.sign(finalizeDto);
    await this.sendDataAsset(signedDataAsset, ParticipantType.CONSUMER);
    return signedDataAsset;
  }

  /**
   * The GX-DCS offers an endpoint for validation of a provided finalized Agreement.
   * The GX-DCS evaluates the finalized Agreement and returns whether a finalized Agreement is valid or not, including a humanreadable explanation.
   * @param dataAsset
   * @returns
   */
  async validate(dataAsset: DataAssetPresentation) {
    await this.signatureService.validateSignature(dataAsset, ParticipantType.PROVIDER);
    await this.signatureService.validateSignature(dataAsset, ParticipantType.CONSUMER);
    await this.signatureService.validateSignature(dataAsset, 'DCT');
    return { isValid: true };
  }

  /**
   * The GX-DCS offers an endpoint for getting a Log Token.
   * The prerequisite for that is a valid finalized Agreement which contains optional or mandatory logging.
   * It returns a Log Token if the submitted finalized Agreement is valid.
   * @param dataAssetPresentation
   * @returns
   */
  async logToken(dataAssetPresentation: DataAssetPresentation) {
    await this.validate(dataAssetPresentation);
    const dataAsset = dataAssetPresentation.verifiableCredential[0].credentialSubject;
    const isLoggingEnabled =
      dataAsset['gax:contractOffer']['gax:logging_mandatory'] ||
      ['gax:LoggingMandatory', 'gax:logging_optional'].includes(dataAsset['gax:contractOffer']['gax:loggingMode']);

    if (!isLoggingEnabled) {
      throw new ValidationException('Forbidden – Finalized Agreement indicates the logging is not allowed', 403);
    }

    return this.logTokenService.getLogToken(dataAsset);
  }

  /**
   * Transfer Contract. This could be used to automatically evaluate Agreements or to establish manual Confirmation flows on the Provider side.
   * The Providers need to offer an endpoint (that the GX-DCS can transfer contract offers to) utilizing the property gax:hasLegallyBindingAddress in their Self Descriptions.
   * MUST forward the Agreement to the Data Provider and MUST inform the Data Consumer about it.
   * @param contract
   */
  protected async sendDataAsset(dataAssetPresentation: DataAssetPresentation, type: ParticipantType) {
    //TBD
    const hasLegallyBindingAddress =
      dataAssetPresentation.verifiableCredential[0].credentialSubject['gax:distribution'][
      'gax:hasLegallyBindingAddress'
      ];
    if (hasLegallyBindingAddress) {
      //POST to legally binding address
      // send signed contract to provider
    }
  }

  /**
   * The GX-DCS MUST accept only Agreements that have the value true assigned to all gax:negotiable properties inside the Rules
   * @param dataAsset
   * @returns boolean
   */
  protected isNegotiable(dataAsset: DataAsset): boolean {
    const permissions: GaxPermission[] = (<unknown>dataAsset['gax:contractOffer']['gax:permission']) as GaxPermission[];
    for (const permission of permissions) {
      if (!permission['gax:negotiable']) {
        return false;
      }
    }
    return true;
  }

  /**
   * In the case of making an Agreement the GX-DCS MUST accept only Agreements that have the value false assigned to the gax:confirmationRequired property.
   * @param contract
   */
  protected isConfirmationRequired(dataAsset: DataAsset): boolean {
    return dataAsset['gax:contractOffer']['gax:confirmationRequired'];
  }

  /**
   * Forbidden – the “general terms” are not empty, but the requesting Participant is not a human being
   * @param contract
   * @returns boolean
   */
  protected isGeneralTermsEmpty(dataAsset: DataAsset): boolean {
    if (dataAsset['gax:contractOffer']['gax:generalTerms'] === '') {
      return false;
    }
    return true;
  }
}
