import { DataAsset } from "../dtos/data-asset.dto";
import { IVerifiableCredential } from "../dtos/verifiable-presentation.dto";
import { DataAssetStatus, ParticipantStatus } from "../services/agreement-validation.service";
import { ParticipantType } from "../services/agreement.service";

export type DidDocument<T> = {
    contextUrl: string | null;
    documentUrl: string;
    document: T
}

export type PublicKey = {
    "@context": string;
    "id": string;
    "type": string;
    "controller": string;
    "publicKeyBase58": string;
}

export type Controller = {
    "@context": "https://w3id.org/security/v2",
    "id": string,
    "assertionMethod": string[]
}

export type LogToken = {
    'gax-dcs:logID': string
    'gax-dcs:dataTransactionID': string
    'gax-dcs:contractID': string
    iss: string
    sub: string
    aud: string
    exp: number
}

export abstract class AbstractTrustServiceAdapter {
    abstract validateParticipant(dataAsset: DataAsset, type: ParticipantType): Promise<ParticipantStatus>;
    abstract getParticipantPublicKey(participantDID: string): Promise<DidDocument<PublicKey>>;
    abstract isParticipantKeyDID(participantDID: string): Promise<boolean>;
    abstract getControllerDIDDocument(controllerDID: string): Promise<DidDocument<Controller>>;
    abstract isControllerDID(controllerDID: string): Promise<boolean>;
}

export abstract class AbstractFederatedCatalogAdapter {
    abstract validateDataAsset(dataAsset: DataAsset): Promise<DataAssetStatus>;
    abstract removeConsumerDetails(dataAsset: IVerifiableCredential<DataAsset>): Promise<IVerifiableCredential<DataAsset>>;
    abstract getProviderProof(dataAsset: DataAsset): Promise<{ verificationMethod: string }>;
}

export abstract class AbstractLogTokenAdapter {
    abstract getLogToken(dataAsset: DataAsset): Promise<LogToken>;
}