import * as vc from '@digitalcredentials/vc';
import { Injectable } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';
import { extendContextLoader } from 'jsonld-signatures';
import { ConfigType } from '../../config/config.module';
import { AbstractTrustServiceAdapter } from "../adapters";

@Injectable()
export class DocumentLoaderService {

    constructor(private readonly trustServiceAdapter: AbstractTrustServiceAdapter, private readonly configService: ConfigService<ConfigType>) { }

    get loader(): () => Promise<any> {
        const dcsSigntureKP = this.configService.get('signature', { infer: true });
        return extendContextLoader(async (url: string) => {
            if (url === dcsSigntureKP.controller) {
                return {
                    contextUrl: null,
                    documentUrl: url,
                    document: {
                        "@context": "https://w3id.org/security/v2",
                        "id": dcsSigntureKP.controller,
                        "assertionMethod": [
                            dcsSigntureKP.id
                        ]
                    }
                }
            }
            if (url === dcsSigntureKP.id) {
                return {
                    contextUrl: null,
                    documentUrl: url,
                    document: {
                        ...dcsSigntureKP,
                        "@context": "https://w3id.org/security/suites/ed25519-2018/v1"
                    }
                }
            }
            if (await this.trustServiceAdapter.isControllerDID(url)) {
                return this.trustServiceAdapter.getControllerDIDDocument(url);
            }
            if (await this.trustServiceAdapter.isParticipantKeyDID(url)) {
                return this.trustServiceAdapter.getParticipantPublicKey(url);
            }
            return vc.defaultDocumentLoader(url);
        })
    }
}