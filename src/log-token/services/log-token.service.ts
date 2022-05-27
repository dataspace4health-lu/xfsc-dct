import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { LogTokenGateway } from '../gateways/log-token.gateway';
import { ContractDto, GaxProof } from 'Gateways/dtos/contract.dto';
import { ConfigService } from '@nestjs/config';
import { ConfigType } from 'Config/config.module';

@Injectable()
export class LogTokenService {
    public constructor(
      protected logTokenApi: LogTokenGateway, 
      protected readonly configService: ConfigService<ConfigType>
    ) {}

    create(logTokenDto: ContractDto) {
      const contractOffer = logTokenDto.verifiableCredential[0].credentialSubject['gax:contractOffer'];
      const shouldLog = contractOffer['gax:loggingMode'];

      if (shouldLog !== 'gax:LoggingMandatory' && shouldLog !== 'gax:LoggingOptional') {
        throw new ForbiddenException();
      }

      const isValidSig = this.checkSignatures(logTokenDto.proof);

      if (!isValidSig) {
        throw new UnauthorizedException();
      }

      return this.getToken(logTokenDto.verifiableCredential[0].credentialSubject['@id']);
    }

    checkSignatures(signatures:  GaxProof[]) {
      return this.logTokenApi.checkSignatures(signatures);
    }

    getToken(id: string) {
      return this.logTokenApi.getToken(id);
    }
}
