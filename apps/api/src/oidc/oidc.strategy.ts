import { Inject, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Client, UserinfoResponse, TokenSet, Issuer } from 'openid-client';
import { ConfigType } from '../config/config.module';
import { Request } from 'express';

export class OidcStrategy extends PassportStrategy(Strategy, 'oidc') {
  client: Client;

  constructor(private readonly configService: ConfigService<ConfigType>, @Inject('Client') client: Client) {
    const { redirectUri, scope } = configService.get('oidc', { infer: true });
    
    super({
      client: client,
      params: {
        redirect_uri: redirectUri,
        scope: scope,
      },
      passReqToCallback: true,
      usePKCE: false,
    });

    this.client = client;
  }

  async validate(request: Request, tokenset: TokenSet): Promise<any> {   
    const userinfo: UserinfoResponse = await this.client.userinfo(tokenset);
    //console.log("OidcStrategy got userinfo", userinfo);

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
      request['user'] = user;
      return user;
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}