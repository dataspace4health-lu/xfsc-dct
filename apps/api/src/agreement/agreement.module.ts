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
import { AbstractFederatedCatalogAdapter, AbstractLogTokenAdapter } from './adapters';
import { FederatedCatalogAdapter } from './adapters/federated-catalog.adapter';
import { LogTokenAdapter } from './adapters/log-token.adapter';
import { AgreementController } from './controllers/agreement.controller';
import { FederatedCatalogGateway } from './gateways/federated-catalog.gateway';
import { DidResolverGateway } from './gateways/did-resolver.gateway';
import { SdqueueProcessor } from './processors/sdqueue.processor';
import { AgreementSignatureService } from './services/agreement-signature.service';
import { AgreementValidationService } from './services/agreement-validation.service';
import { AgreementService } from './services/agreement.service';
import { DocumentLoaderService } from './services/did-document-loader.service';
import { LogTokenService } from './services/log-token.service';
import { UtilsService } from './services/utils.service';
import { LogTokenController } from './controllers/log-token.controller';
import { UtilsController } from './controllers/utils.controller';
import { Client, Issuer } from 'openid-client';
import { OidcStrategy } from '../oidc/oidc.strategy';

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
      inject: [DidResolverGateway],
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
    DidResolverGateway,
    {
      provide: AbstractFederatedCatalogAdapter,
      useClass: FederatedCatalogAdapter,
    },
    DocumentLoaderService,
    {
      provide: AbstractLogTokenAdapter,
      useClass: LogTokenAdapter,
    },
    LogTokenService,
    UtilsService,
    ConfigService,
    {
      provide: 'Client',
      useFactory: async (configService: ConfigService<ConfigType>) => {
        const { issuer, clientId, clientSecret, scope } = configService.get('oidc', { infer: true });
  
        const TrustIssuer = await Issuer.discover(`${issuer}/.well-known/openid-configuration`);
        const client = new TrustIssuer.Client({
          client_id: clientId,
          client_secret: clientSecret,
          scope: scope,
        });

        return client;
      },
      inject: [ConfigService],
    },
    {
      provide: 'OidcStrategy',
      useFactory: async (configService: ConfigService<ConfigType>, client: Client) => {
        const strategy = new OidcStrategy(configService, client);
        return strategy;
      },
      inject: [ConfigService, 'Client'],
    },
    FederatedCatalogAdapter
  ],
  controllers: [AgreementController, LogTokenController, UtilsController],
  exports: [DidResolverGateway, FederatedCatalogAdapter]
})
export class AgreementModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RdfBodyParserMiddleware).forRoutes(AgreementController);
  }
}


