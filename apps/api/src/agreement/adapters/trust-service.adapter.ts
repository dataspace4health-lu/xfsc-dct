import { HttpException, Injectable } from '@nestjs/common';
import { AbstractTrustServiceAdapter } from '.';
import { DataAsset } from '../dtos/data-asset.dto';
import { TrustServiceGateway } from '../gateways/trust-service.gateway';
import { ParticipantStatus } from '../services/agreement-validation.service';
import { ParticipantType } from '../services/agreement.service';

/**
 * The Trust Service is paramount for validating signatures.
 * To this end, it provides functionality to resolve DIDs and
 * retrieve public keys of any Participant. The Trust Service
 * is only part of Gaia-X’s Identity and Access Management framework,
 * but for GX-DCS it’s the only part that’s needed.
 */
@Injectable()
export class TrustServiceAdapter extends AbstractTrustServiceAdapter {
  constructor(private readonly trustServiceGateway: TrustServiceGateway) {
    super();
  }

  /**
   * Validate participant verifies that the user is a GX Participant
   * In general, only Gaia-X Participants must be able to interact with the GX-DCS.
   * Each participant shall be capable of registering Data Assets, negotiate,
   * or make a Data Contracts for a Data Asset and get a validation confirmation
   * for a finalized Agreement.
   * @param dataAsset
   * @param type
   * @returns
   */
  validateParticipant(dataAsset: DataAsset, type: ParticipantType): Promise<ParticipantStatus> {
    const participantDID = type === ParticipantType.CONSUMER ? dataAsset['gax:consumer'] : dataAsset['gax:publisher'];
    if (!participantDID) {
      throw new HttpException(`Not found – Data Provider DID could not be resolved`, 404);
    }
    return this.trustServiceGateway.getParticipant(participantDID) as Promise<ParticipantStatus>;
  }



  /**
   * Verifies if Service is healthy
   * @returns
   */
  public async isHealthy(): Promise<boolean> {
    const healtyStatus = await this.trustServiceGateway.getHealthStatus();
    return healtyStatus['status'] === 'ok';
  }
}
