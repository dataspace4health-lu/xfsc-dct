import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DataAssetPresentation } from '../dtos/data-asset.dto';
import { ParticipantType } from './agreement.service';
import { DocumentLoaderService } from './did-document-loader.service';
import * as vc from '@digitalcredentials/vc';
import { purposes } from 'jsonld-signatures';
import { v4 as uuidv4 } from 'uuid';
import { AbstractFederatedCatalogAdapter } from '../adapters';
import { SignatureService } from '@gaia-x/gaia-x-vc';

@Injectable()
export class AgreementSignatureService {
  documentLoader: () => Promise<any>;

  constructor(
    private readonly documentLoaderService: DocumentLoaderService,
    private readonly federatedCatalogAdapter: AbstractFederatedCatalogAdapter,
    private readonly dcsSuite: any,
    private readonly signatureService: SignatureService,
  ) {
    this.documentLoader = this.documentLoaderService.loader;
  }

  /**
   * GX-DCS MUST ensure that the completed Data Asset Self-Description contains valid signature(s).
   * Checks PROVIDER, CONSUMER, DCT signatures based on type.
   * @param presentation
   * @param type
   */
  async validateSignature(presentation: DataAssetPresentation, type: ParticipantType | 'DCT') {
    let isValid = true;
    switch (type) {
      case ParticipantType.PROVIDER: {
        isValid = await this.validateProviderSignature(presentation);
        break;
      }
      case ParticipantType.CONSUMER: {
        isValid = await this.validateConsumerSignature(presentation);
        break;
      }
      default: {
        isValid = await this.verifyDCSPresentation(presentation);
      }
    }
    if (!isValid) {
      throw new UnauthorizedException(`Unauthorized – invalid ${type} signature`);
    }
  }

  /**
   * If the validation of the Data Asset Self-Description and the providers signature were correct,
   * the GX-DCS MUST add its signature to the Data Asset Self-Description using a hash that includes
   * the signature of the Data Provider and send the resulting signed SD back to the Data Provider (for both interfaces).
   * @param presentationDataAsset
   * @returns
   */
  async sign(presentationDataAsset: DataAssetPresentation): Promise<DataAssetPresentation> {
    const presentation = vc.createPresentation({
      verifiableCredential: [presentationDataAsset.verifiableCredential[0]],
    });
    const challenge = uuidv4();
    const verifiablePresentation = await vc.signPresentation({
      presentation,
      suite: this.dcsSuite,
      challenge,
      documentLoader: this.documentLoader,
      // purpose: new purposes.AssertionProofPurpose(),
    });
    return verifiablePresentation;
  }

  /**
   * If the validation of the Data Asset Self-Description and the providers signature were correct,
   * the GX-DCS MUST add its signature to the Data Asset Self-Description using a hash that includes
   * the signature of the Data Provider and send the resulting signed SD back to the Data Provider (for both interfaces).
   * @param presentation
   * @returns
   */
  async verifyDCSPresentation(presentation: DataAssetPresentation): Promise<boolean> {
    const { presentationResult: { verified } } = await vc.verify({
      presentation,
      suite: this.dcsSuite,
      challenge: (presentation.proof[0] as any).challenge,
      documentLoader: this.documentLoader,
    });
    return verified;
  }

  /**
   * Validates Provider Signature from presentation
   * @param presentation
   * @returns
   */
  protected async validateProviderSignature(presentation: DataAssetPresentation) {
    const credential = await this.federatedCatalogAdapter.removeConsumerDetails(presentation.verifiableCredential[0]);
    const providerProof = await this.federatedCatalogAdapter.getProviderProof(
      presentation.verifiableCredential[0].credentialSubject,
    );
    const { results } = await this.signatureService.verifyCredential(credential);
    return (
      results?.find((result: any) => result.proof.verificationMethod === providerProof.verificationMethod)?.verified ??
      false
    );
  }

  /**
   * Validates Consumer Signature from presentation
   * @param presentation
   * @returns
   */
  protected async validateConsumerSignature(presentation: DataAssetPresentation) {
    const consumerProof = await this.federatedCatalogAdapter.getConsumerProof(
      presentation.verifiableCredential[0].credentialSubject,
    );
    const { results } = await this.signatureService.verifyCredential(presentation.verifiableCredential[0]);
    return (
      results?.find((result: any) => result.proof.verificationMethod === consumerProof.verificationMethod)?.verified ??
      false
    );
  }
}
