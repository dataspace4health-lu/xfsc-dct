import { BullModule } from "@nestjs/bull";
import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { RdfInterceptor } from "../global/interceptors/rdf.interceptor";
import { RdfBodyParserMiddleware } from "../global/middlewares/rdf.parser.middleware";
import { TrustServiceAdapter } from "./adapters/trust-service.adapter";
import { AbstractFederatedCatalogAdapter, AbstractTrustServiceAdapter } from "./adapters";
import { AgreementController } from "./controllers/agreement.controller";
import { FederatedCatalogGateway } from "./gateways/federated-catalog.gateway";
import { SdqueueProcessor } from "./processors/sdqueue.processor";
import { AgreementSignatureService } from "./services/agreement-signature.service";
import { AgreementValidationService } from "./services/agreement-validation.service";
import { AgreementService } from "./services/agreement.service";
import { TrustServiceGateway } from "./gateways/trust-service.gateway";
import { FederatedCatalogAdapter } from "./adapters/federated-catalog.adapter";
import { DocumentLoaderService } from "./services/did-document-loader.service";
import { ConfigService } from "@nestjs/config";
import { ConfigType } from "../config/config.module";
import { Ed25519VerificationKey2018 } from '@digitalbazaar/ed25519-verification-key-2018'; 

@Module({
    imports: [
        BullModule.registerQueue({ name: 'processSds' })
    ],
    providers: [
        AgreementValidationService,
        {
            provide: AgreementSignatureService,
            useFactory: async (
                documentLoaderService: DocumentLoaderService,
                federatedCatalogAdapter: AbstractFederatedCatalogAdapter,
                configService: ConfigService<ConfigType>) => {
                const { Ed25519Signature2018 } = await import('@digitalbazaar/ed25519-signature-2018');
                const keyConfig = configService.get('signature', { infer: true });
                const key = new Ed25519VerificationKey2018(keyConfig);
                const dcsSuite = new Ed25519Signature2018({key});

                return new AgreementSignatureService(documentLoaderService, federatedCatalogAdapter, dcsSuite, [new Ed25519Signature2018()]);
            },
            inject: [DocumentLoaderService, AbstractFederatedCatalogAdapter, ConfigService]
        },
        AgreementService,
        {
            provide: APP_INTERCEPTOR,
            useClass: RdfInterceptor
        },
        FederatedCatalogGateway,
        SdqueueProcessor,
        {
            provide: AbstractTrustServiceAdapter,
            useClass: TrustServiceAdapter
        },
        TrustServiceGateway,
        {
            provide: AbstractFederatedCatalogAdapter,
            useClass: FederatedCatalogAdapter
        },
        FederatedCatalogGateway,
        DocumentLoaderService
    ],
    controllers: [AgreementController]
})
export class AgreementModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(RdfBodyParserMiddleware).forRoutes(
            AgreementController
        );
    }
}