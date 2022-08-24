import { Injectable } from '@nestjs/common';
import { AbstractTrustServiceAdapter, Controller, DidDocument, PublicKey } from '.';
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
    return this.trustServiceGateway.getParticipant(participantDID) as Promise<ParticipantStatus>;
  }

  /**
   * Retrieve public keys of any Participant
   * @param participantDID
   * @returns
   */
  async getParticipantPublicKey(participantDID: string): Promise<DidDocument<PublicKey>> {
    const document = (await this.trustServiceGateway.getParticipantKey(participantDID)) as any;
    return {
      contextUrl: null,
      documentUrl: participantDID,
      document: {
        '@context': 'https://w3id.org/security/suites/ed25519-2018/v1',
        ...document,
      },
    };
  }

  /**
   * Verifies if participant match
   * @param participantDID
   * @returns
   */
  async isParticipantKeyDID(participantDID: string) {
    return participantDID.match(/^did:(provider|consumer):key:123/) !== null;
  }

  /**
   * Verifies if Document matches
   * @param controller
   * @returns
   */
  async getControllerDIDDocument(controller: string): Promise<DidDocument<Controller>> {
    const type = /did:(\w+):controller/gi.exec(controller)[1];
    return {
      contextUrl: null,
      documentUrl: controller,
      document: {
        '@context': 'https://w3id.org/security/v2',
        id: `did:${type}:controller`,
        assertionMethod: [`did:${type}:key:123`],
      },
    };
  }

  /**
   * Verifies if controllerDID matches
   * @param controllerDID
   * @returns
   */
  async isControllerDID(controllerDID: string): Promise<boolean> {
    return controllerDID.match(/^did:(provider|consumer):controller$/) !== null;
  }

  /**
   * Verifies if Service is healthy
   * @returns
   */
  async isHealthy(): Promise<boolean> {
    return true;
  }
}
