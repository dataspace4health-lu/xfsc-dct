import { Injectable, HttpException } from '@nestjs/common';
import { AbstractFederatedCatalogAdapter } from '.';
import { DataAsset } from '../dtos/data-asset.dto';
import { FederatedCatalogGateway } from '../gateways/federated-catalog.gateway';
import { DataAssetStatus } from '../services/agreement-validation.service';
import { isEqual, omit, pick } from 'lodash';
import { IVerifiableCredential } from '@gaia-x/gaia-x-vc';
import { ParticipantType } from '../services/agreement.service';
import { ParticipantStatus } from '../services/agreement-validation.service';

/**
 *
 * This is the place where Data Providers publish Data Asset SDs.
 * The fine details don’t belong here, but in general, GX-FC expects
 * Data Providers to operate an endpoint where GX-FC can subscribe to Data Asset SDs.
 */
@Injectable()
export class FederatedCatalogAdapter extends AbstractFederatedCatalogAdapter {
  constructor(private readonly federatedCatalogGateway: FederatedCatalogGateway) {
    super();
  }

  /**
   * The GX-DCS MUST check with the Federated Catalogue if the original Data Asset Self-Description of the
   * submitted Agreement is valid and MUST compare the original with the submitted one.
   * @param dataAsset
   * @returns
   */
  async validateDataAsset(dataAsset: DataAsset): Promise<DataAssetStatus> {
    const originalDataAsset = await this.federatedCatalogGateway.getDataAsset(dataAsset['@id']);
    const fileds = ['id', 'gx:name', 'gx:description', 'gx:providedBy'] as Array<keyof DataAsset>;
    const valid = isEqual(pick(originalDataAsset, fileds), pick(dataAsset, fileds));

    const isSupported = true;
    return {
      valid,
      isSupported,
    };
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
    async validateParticipant(access_token: string, dataAsset: DataAsset, type: ParticipantType): Promise<ParticipantStatus> {
      const participantDID = type === ParticipantType.CONSUMER ? dataAsset['gx:consumer'] : dataAsset['gx:providedBy']["id"];
      if (!participantDID) {
        throw new HttpException(`Not found – Data Provider DID could not be resolved`, 404);
      }
      // return this.federatedCatalogGateway.getParticipant(access_token, participantDID) as Promise<ParticipantStatus>;

      const apiResponse = await this.federatedCatalogGateway.getParticipant(access_token, participantDID);

      const participantStatus: ParticipantStatus = {
        exists: apiResponse?.totalCount > 0, // Ensures at least one participant is found
        isRevoked: apiResponse?.items?.[0]?.meta?.status !== 'active', // Checks if status is not 'active'
      };

      console.log('Processed participantStatus:', JSON.stringify(participantStatus));
      return participantStatus;
    }

  /**
   * To correctly validate the provider signature the DCS MUST remove the Consumer Details beforehand.
   * @param credential
   * @returns
   */
  async removeConsumerDetails(credential: IVerifiableCredential<DataAsset>): Promise<IVerifiableCredential<DataAsset>> {
    return {
      ...credential,
      credentialSubject: omit(credential.credentialSubject, 'gx:consumer'),
      issuer: 'did:provider:controller',
    };
  }

  /**
   * Get provider proof in order to sign the Data Asset with it
   * @param dataAsset
   * @returns
   */
  async getProviderProof(dataAsset: DataAsset) {
    return {
      verificationMethod: dataAsset['gx:publisher'] + ':key:123',
    };
  }

  /**
   * Get Consumer proof in order to sign Data Asset with it
   * @param dataAsset
   * @returns
   */
  async getConsumerProof(dataAsset: DataAsset) {
    return {
      verificationMethod: dataAsset['gx:consumer'] + ':key:123',
    };
  }

  /**
   * GX-DCS MUST check if the Consumer conforms to the policies, insofar that is technically feasible with fungible effort.
   * @param dataAsset
   * @returns
   */
  async isConsumerConformPolicies(dataAsset: DataAsset): Promise<boolean> {
    return true;
  }

  /**
   * Verifies if Service is healthy
   * @returns
   */
  async isHealthy(): Promise<boolean> {
    const healthStatus = await this.federatedCatalogGateway.getHealthStatus();
    return healthStatus ? healthStatus['status'] === 'UP' : false;
  }
}
