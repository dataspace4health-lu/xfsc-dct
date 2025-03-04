import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Client, UserinfoResponse, TokenSet, Issuer } from 'openid-client';
import { OidcService } from './oidc.service';
import { ConfigType } from '../config/config.module';

export const buildOpenIdClient = async (configService: ConfigService<ConfigType>) => {
  const { issuer, clientId, clientSecret } = configService.get('oidc', { infer: true });
  
  const TrustIssuer = await Issuer.discover(`${issuer}/.well-known/openid-configuration`);
  const client = new TrustIssuer.Client({
    client_id: clientId,
    client_secret: clientSecret,
  });
  return client;
};

export class OidcStrategy extends PassportStrategy(Strategy, 'oidc') {
  client: Client;

  constructor(private readonly oidcService: OidcService, client: Client, configService: ConfigService<ConfigType>) {
    const { redirectUri, scope } = configService.get('oidc', { infer: true });
    
    super({
      client: client,
      params: {
        redirect_uri: redirectUri,
        scope: scope,
      },
      passReqToCallback: false,
      usePKCE: false,
    });

    this.client = client;
  }

  async validate(tokenset: TokenSet): Promise<any> {
    const userinfo: UserinfoResponse = await this.client.userinfo(tokenset);

    try {
      const id_token = tokenset.id_token
      const access_token = tokenset.access_token
      const refresh_token = tokenset.refresh_token
      const user = {
        id_token,
        access_token,
        refresh_token,
        userinfo,
      }
      return user;
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}