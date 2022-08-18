import { Injectable } from "@nestjs/common";
import { AbstractFederatedCatalogAdapter } from ".";
import { DataAsset } from "../dtos/data-asset.dto";
import { IVerifiableCredential } from "../dtos/verifiable-presentation.dto";
import { FederatedCatalogGateway } from "../gateways/federated-catalog.gateway";
import { DataAssetStatus } from "../services/agreement-validation.service";
import { isEqual, omit, pick } from 'lodash';

@Injectable()
export class FederatedCatalogAdapter extends AbstractFederatedCatalogAdapter {


    constructor(private readonly federatedCatalogGateway: FederatedCatalogGateway) {
        super();
    }

    async validateDataAsset(dataAsset: DataAsset): Promise<DataAssetStatus> {
        const originalDataAsset = await this.federatedCatalogGateway.getDataAsset(dataAsset["@id"]);
        const fileds = ['@id', 'gax:title', 'gax:description', 'gax:creator', 'gax:publisher'] as Array<keyof DataAsset>;
        const valid = isEqual(pick(originalDataAsset, fileds), pick(dataAsset, fileds));

        const isSupported = true;
        return {
            valid,
            isSupported
        }
    }
    async removeConsumerDetails(credential: IVerifiableCredential<DataAsset>): Promise<IVerifiableCredential<DataAsset>> {
        return {
            ...credential,
            credentialSubject: omit(credential.credentialSubject, 'gax:consumer'),
            issuer: 'did:provider:controller'
        }
    }

    async getProviderProof(dataAsset: DataAsset) {
        return {
            verificationMethod: dataAsset["gax:publisher"] + ':key:123',
        }
    }

}