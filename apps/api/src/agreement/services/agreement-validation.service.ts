import { HttpException, Injectable } from '@nestjs/common';
import { AbstractFederatedCatalogAdapter } from '../adapters';
import { DataAsset } from '../dtos/data-asset.dto';
import { ParticipantType } from './agreement.service';

export type ParticipantStatus = {
  exists: boolean;
  isRevoked: boolean;
};

export type DataAssetStatus = {
  valid: boolean;
  isSupported: boolean;
};

@Injectable()
export class AgreementValidationService {
  constructor(
    private readonly federatedCatalog: AbstractFederatedCatalogAdapter,
  ) {}

  /**
   * Validates participant
   * @param dataAsset
   * @param type
   */
  async assertParticipant(access_token: string, dataAsset: DataAsset, type: ParticipantType) {
    const { exists, isRevoked } = await this.federatedCatalog.validateParticipant(access_token, dataAsset, type);
    if (!exists) {
      throw new HttpException(`Forbidden – the requesting Participant is not a human being`, 403);
    }
    if (isRevoked) {
      throw new HttpException(
        `Unavailable for legal reasons, Gaia-X Participant status has
            been revoked`,
        451,
      );
    }
  }

  /**
   * Validated contract/data asset
   * @param dataAsset
   */
  async assertDataAsset(access_token: string, dataAsset: DataAsset) {
    const { valid, isSupported } = await this.federatedCatalog.validateDataAsset(access_token, dataAsset);
    if (!valid) {
      throw new HttpException(`Failed dependency – could not validate Data Asset Self-Description model`, 424);
    }
    if (!isSupported) {
      throw new HttpException(` Upgrade required – Data Asset SD model is no longer supported`, 426);
    }
  }
}
