import { Ed25519VerificationKey2018 } from '@digitalbazaar/ed25519-verification-key-2018';
import { BullModule } from '@nestjs/bull';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { DIDTrustServiceGateway, SignatureService, VerifiableCredentialModule } from '@gaia-x/gaia-x-vc';
import { ConfigType } from '../config/config.module';
import { RdfInterceptor } from '../global/interceptors/rdf.interceptor';
import { RdfBodyParserMiddleware } from '../global/middlewares/rdf.parser.middleware';
import { AbstractFederatedCatalogAdapter, AbstractLogTokenAdapter, AbstractTrustServiceAdapter } from './adapters';
import { FederatedCatalogAdapter } from './adapters/federated-catalog.adapter';
import { LogTokenAdapter } from './adapters/log-token.adapter';
import { TrustServiceAdapter } from './adapters/trust-service.adapter';
import { AgreementController } from './controllers/agreement.controller';
import { FederatedCatalogGateway } from './gateways/federated-catalog.gateway';
import { TrustServiceGateway } from './gateways/trust-service.gateway';
import { SdqueueProcessor } from './processors/sdqueue.processor';
import { AgreementSignatureService } from './services/agreement-signature.service';
import { AgreementValidationService } from './services/agreement-validation.service';
import { AgreementService } from './services/agreement.service';
import { DocumentLoaderService } from './services/did-document-loader.service';
import { LogTokenService } from './services/log-token.service';
import { UtilsService } from './services/utils.service';
import { LogTokenController } from './controllers/log-token.controller';
import { UtilsController } from './controllers/utils.controller';


@Module({
  imports: [
    BullModule.registerQueue({ name: '{processSds}' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService<ConfigType>) => {
        const tokenConfig = config.get('logToken', { infer: true });
        return tokenConfig;
      },
    }),
    VerifiableCredentialModule.registerAsync({
      imports: [AgreementModule],
      inject: [TrustServiceGateway],
      useFactory: (didTrustServiceGateway: DIDTrustServiceGateway) => {
        return { didTrustServiceGateway }
      }
    }),
  ],
  providers: [
    AgreementValidationService,
    {
      provide: AgreementSignatureService,
      useFactory: async (
        documentLoaderService: DocumentLoaderService,
        federatedCatalogAdapter: AbstractFederatedCatalogAdapter,
        configService: ConfigService<ConfigType>,
        signatureService: SignatureService
      ) => {
        const { Ed25519Signature2018 } = await import('@digitalbazaar/ed25519-signature-2018');
        const keyConfig = configService.get('signature', { infer: true });
        const key = new Ed25519VerificationKey2018(keyConfig);
        const dcsSuite = new Ed25519Signature2018({ key });

        return new AgreementSignatureService(documentLoaderService, federatedCatalogAdapter, dcsSuite, signatureService);
      },
      inject: [DocumentLoaderService, AbstractFederatedCatalogAdapter, ConfigService, SignatureService],
    },
    AgreementService,
    {
      provide: APP_INTERCEPTOR,
      useClass: RdfInterceptor,
    },
    FederatedCatalogGateway,
    SdqueueProcessor,
    {
      provide: AbstractTrustServiceAdapter,
      useClass: TrustServiceAdapter,
    },
    TrustServiceGateway,
    {
      provide: AbstractFederatedCatalogAdapter,
      useClass: FederatedCatalogAdapter,
    },
    FederatedCatalogGateway,
    DocumentLoaderService,
    {
      provide: AbstractLogTokenAdapter,
      useClass: LogTokenAdapter,
    },
    LogTokenService,
    UtilsService,
  ],
  controllers: [AgreementController, LogTokenController, UtilsController],
  exports: [TrustServiceGateway]
})
export class AgreementModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RdfBodyParserMiddleware).forRoutes(AgreementController);
  }
}


