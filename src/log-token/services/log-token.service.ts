import { ForbiddenException, Injectable } from '@nestjs/common';
import { LogTokenGateway } from '../gateways/log-token.gateway';
import { ConfigService } from '@nestjs/config';
import { ConfigType } from 'Config/config.module';
import { CommonGateway } from 'Global/gateways/common.gateway';
import { ContractDto, GaxProof } from 'Gateways/dtos/contract.dto';
import { v4 as uuidv4 } from 'uuid';
import { UnauthorizedException } from 'Common/exceptions/unauthorized.exception';

@Injectable()
export class LogTokenService {
  public constructor(
    protected logTokenApi: LogTokenGateway,
    protected readonly configService: ConfigService<ConfigType>,
    protected commonApi: CommonGateway,
  ) {}

  async create(logTokenDto: ContractDto) {
    const contractOffer = logTokenDto.VerifiableCredential.credentialSubject['gax:contractOffer'];
    const proofs: GaxProof[] = (<unknown>logTokenDto.VerifiableCredential.proof) as GaxProof[];
    const shouldLog = contractOffer['gax:loggingMode'];
    const validSD = await this.checkSD(logTokenDto);

    if (!validSD) {
      throw new UnauthorizedException('SD could not be resolved.');
    }

    if (shouldLog !== 'gax:LoggingMandatory' && shouldLog !== 'gax:LoggingOptional' && !validSD) {
      throw new ForbiddenException();
    }

    const isValidSig = await this.checkSignatures((<unknown>proofs) as GaxProof[]);

    if (!isValidSig) {
      throw new UnauthorizedException('Invalid Signiture.');
    }

    const logID = uuidv4();

    const logToken = {
      'gax-dcs:logID': logID,
      'gax-dcs:dataTransactionID': '123',
      'gax-dcs:contractID': '123',
      iss: '(Logging service ID)',
      sub: '(Participant ID)',
      aud: '(GX-DELS identifier)',
      exp: Math.floor(new Date().getTime() / 1000) + this.configService.get('general.tokenCacheTTL', { infer: true }),
    };

    return logToken;
  }

  async checkSD(document: ContractDto) {
    return await this.commonApi.checkSD(document);
  }

  async checkSignatures(signatures: GaxProof[]) {
    return await this.commonApi.checkSignatures(signatures);
  }
}
