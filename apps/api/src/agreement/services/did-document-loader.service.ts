import { Injectable } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';
import { DocumentLoaderService as GaiaxDocumentLoaderService } from '@gaia-x/gaia-x-vc';
import { extendContextLoader } from 'jsonld-signatures';
import { ConfigType } from '../../config/config.module';


@Injectable()
export class DocumentLoaderService {
    protected gaiaxDocumentLoader: (url:string)=>Promise<any>

    constructor( private readonly configService: ConfigService<ConfigType>, documentLoaderService: GaiaxDocumentLoaderService) {
        this.gaiaxDocumentLoader = documentLoaderService.loader
     }

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
                            dcsSigntureKP.id,
                        ],
                        "authentication":[
                            dcsSigntureKP.id,
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
            // TODO: add library document loader
            return this.gaiaxDocumentLoader(url);
        })
    }
}