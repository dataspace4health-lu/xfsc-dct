import { Injectable } from "@nestjs/common";
import { AbstractTrustServiceAdapter, Controller, DidDocument, PublicKey } from ".";
import { DataAsset } from "../dtos/data-asset.dto";
import { TrustServiceGateway } from "../gateways/trust-service.gateway";
import { ParticipantStatus } from "../services/agreement-validation.service";
import { ParticipantType } from "../services/agreement.service";


@Injectable()
export class TrustServiceAdapter extends AbstractTrustServiceAdapter {

    constructor(private readonly trustServiceGateway: TrustServiceGateway) {
        super();
    }

    validateParticipant(dataAsset: DataAsset, type: ParticipantType): Promise<ParticipantStatus> {
        const participantDID = type === ParticipantType.CONSUMER ? dataAsset["gax:consumer"] : dataAsset["gax:publisher"];
        return this.trustServiceGateway.getParticipant(participantDID) as Promise<ParticipantStatus>
    }

    async getParticipantPublicKey(participantDID: string): Promise<DidDocument<PublicKey>> {
        const document = await this.trustServiceGateway.getParticipantKey(participantDID) as any;
        return {
            contextUrl: null,
            documentUrl: participantDID,
            document: {
                "@context": "https://w3id.org/security/suites/ed25519-2018/v1",
                ...document
            }
        }
    }

    async isParticipantKeyDID(participantDID: string) {
        return participantDID.match(/^did:(provider|consumer):key:123/) !== null;
    }

    async getControllerDIDDocument(controller: string): Promise<DidDocument<Controller>> {
        const type = /did:(\w+):controller/gi.exec(controller)[1];
        return {
            contextUrl: null,
            documentUrl: controller,
            document: {
                "@context": "https://w3id.org/security/v2",
                "id": `did:${type}:controller`,
                "assertionMethod": [
                    `did:${type}:key:123`
                ]
            }
        }
    }

    async isControllerDID(controllerDID: string): Promise<boolean> {
        return controllerDID.match(/^did:(provider|consumer):controller$/) !== null;
    }

}