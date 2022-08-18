import { Injectable, UnauthorizedException } from "@nestjs/common";
import { DataAssetPresentation } from "../dtos/data-asset.dto";
import { ParticipantType } from "./agreement.service";
import { DocumentLoaderService } from "./did-document-loader.service";
import * as vc from '@digitalcredentials/vc';
import { purposes } from 'jsonld-signatures';
import { v4 as uuidv4 } from 'uuid';
import { AbstractFederatedCatalogAdapter } from "../adapters";

@Injectable()
export class AgreementSignatureService {

    documentLoader: () => Promise<any>;

    constructor(private readonly documentLoaderService: DocumentLoaderService,
        private readonly federatedCatalogAdapter: AbstractFederatedCatalogAdapter,
        private readonly dcsSuite: any,
        private readonly trustServiceSuite: any,
    ) {
        this.documentLoader = this.documentLoaderService.loader;
    }

    async validateSignature(presentation: DataAssetPresentation, type: ParticipantType | 'DCT') {
        let isValid = true;
        switch (type) {
            case ParticipantType.PROVIDER: {
                isValid = await this.validateProviderSignature(presentation);
                break;
            }
        }
        if (!isValid) {
            throw new UnauthorizedException(`Unauthorized – invalid ${type} signature`)
        }
    }

    async sign(presentationDataAsset: DataAssetPresentation): Promise<DataAssetPresentation> {
        const presentation = vc.createPresentation({
            verifiableCredential: [presentationDataAsset.verifiableCredential[0]],
        });
        const verifiablePresentation = await vc.signPresentation({
            presentation, suite: this.dcsSuite, challenge: uuidv4(), documentLoader: this.documentLoader, purpose: new purposes.AssertionProofPurpose()
        });
        return verifiablePresentation
    }

    protected async validateProviderSignature(presentation: DataAssetPresentation) {
        const credential = await this.federatedCatalogAdapter.removeConsumerDetails(presentation.verifiableCredential[0]);
        const providerProof = await this.federatedCatalogAdapter.getProviderProof(presentation.verifiableCredential[0].credentialSubject);
        const { results, error } = await vc.verifyCredential({
            credential,
            challenge: uuidv4(),
            documentLoader: this.documentLoader,
            suite: this.trustServiceSuite,
            purpose: new purposes.AssertionProofPurpose()
        });
        return results?.find((result: any) => result.proof.verificationMethod === providerProof.verificationMethod)?.verified ?? false;
    }

}