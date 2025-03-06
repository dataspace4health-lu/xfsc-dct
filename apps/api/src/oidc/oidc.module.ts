import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { OidcStrategy } from './oidc.strategy';
import { SessionSerializer } from './session.serializer';
import { OidcController } from './oidc.controller';
import { ConfigService } from '@nestjs/config';
import { ConfigType } from '../config/config.module';
import { Client, Issuer } from 'openid-client';

@Module({
  imports: [
    PassportModule.register({ session: true, defaultStrategy: 'oidc' }),
  ],
  controllers: [OidcController],
  providers: [
    SessionSerializer, 
    ConfigService,
    {
      provide: 'Client',
      useFactory: async (configService: ConfigService<ConfigType>) => {
        const { issuer, clientId, clientSecret } = configService.get('oidc', { infer: true });
  
        const TrustIssuer = await Issuer.discover(`${issuer}/.well-known/openid-configuration`);
        const client = new TrustIssuer.Client({
          client_id: clientId,
          client_secret: clientSecret,
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
    }
  ],
})
export class OidcModule {}
