import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { LogTokenGateway } from '../gateways/log-token.gateway';
import { ConfigService } from '@nestjs/config';
import { ConfigType } from 'Config/config.module';
import { CommonGateway } from 'Global/gateways/common.gateway';
import { ContractDto, GaxProof } from 'Gateways/dtos/contract.dto';

@Injectable()
export class LogTokenService {
  public constructor(
    protected logTokenApi: LogTokenGateway,
    protected readonly configService: ConfigService<ConfigType>,
    protected commonApi: CommonGateway,
  ) { }

  async create(logTokenDto: ContractDto) {
    const contractOffer = logTokenDto.VerifiableCredential.credentialSubject['gax:contractOffer'];
    const proofs: GaxProof[] = <unknown>logTokenDto.VerifiableCredential.proof as GaxProof[];
    const shouldLog = contractOffer['gax:loggingMode'];
    const validSD = await this.checkSD(logTokenDto);

    if (!validSD) {
      throw new ForbiddenException();
    }

    if (shouldLog !== 'gax:LoggingMandatory' && shouldLog !== 'gax:LoggingOptional' && !validSD) {
      throw new ForbiddenException();
    }

    const isValidSig = await this.checkSignatures((<unknown>proofs) as GaxProof[]);

    if (!isValidSig) {
      throw new UnauthorizedException();
    }
  }

  async checkSD(document: ContractDto) {
    return await this.commonApi.checkSD(document);
  }


  async checkSignatures(signatures: GaxProof[]) {
    return await this.commonApi.checkSignatures(signatures);
  }

  async getToken(id: string) {
    return await this.logTokenApi.getToken(id);
  }
}
