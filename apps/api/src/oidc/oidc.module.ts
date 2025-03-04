import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { OidcStrategy, buildOpenIdClient } from './oidc.strategy';
import { SessionSerializer } from './session.serializer';
import { OidcService } from './oidc.service';
import { OidcController } from './oidc.controller';
import { ConfigService } from '@nestjs/config';
import { ConfigType } from '../config/config.module';

const OidcStrategyFactory = {
  provide: 'OidcStrategy',
  useFactory: async (oidcService: OidcService, configService: ConfigService<ConfigType>) => {
    const client = await buildOpenIdClient(configService); // secret sauce! build the dynamic client before injecting it into the strategy for use in the constructor super call.
    const strategy = new OidcStrategy(oidcService, client, configService);
    return strategy;
  },
  inject: [OidcService, ConfigService]
};

@Module({
  imports: [
    PassportModule.register({ session: false, defaultStrategy: 'oidc' }),
  ],
  controllers: [OidcController],
  providers: [OidcStrategyFactory, SessionSerializer, OidcService],
})
export class OidcModule {}