import { IVerifiableCredential } from '../dtos/verifiable-presentation.dto';
import { DataAsset } from '../dtos/data-asset.dto';
import { LogToken } from '../dtos/log-token.dto';
import { DataAssetStatus, ParticipantStatus } from '../services/agreement-validation.service';
import { ParticipantType } from '../services/agreement.service';

export abstract class AbstractFederatedCatalogAdapter {
  abstract validateDataAsset(dataAsset: DataAsset): Promise<DataAssetStatus>;
  abstract validateParticipant(access_token: string, dataAsset: DataAsset, type: ParticipantType): Promise<ParticipantStatus>;
  abstract removeConsumerDetails(
    dataAsset: IVerifiableCredential<DataAsset>,
  ): Promise<IVerifiableCredential<DataAsset>>;
  abstract getProviderProof(dataAsset: DataAsset): Promise<{ verificationMethod: string }>;
  abstract getConsumerProof(dataAsset: DataAsset): Promise<{ verificationMethod: string }>;
  abstract isConsumerConformPolicies(dataAsset: DataAsset): Promise<boolean>;
  abstract isHealthy(): Promise<boolean>;
}

export abstract class AbstractLogTokenAdapter {
  abstract getLogToken(dataAsset: DataAsset): Promise<LogToken>;
}
