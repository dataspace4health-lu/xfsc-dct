import { Injectable } from '@nestjs/common';
import { DataAsset } from '../dtos/data-asset.dto';
import { JwtService } from '@nestjs/jwt';
import { AbstractLogTokenAdapter } from '../adapters';
import { LogToken } from '../dtos/log-token.dto';

@Injectable()
export class LogTokenService {
  constructor(private readonly logTokenAdapter: AbstractLogTokenAdapter, private readonly jwtService: JwtService) {}

  /**
   * GX-DCS MUST issue an authorization token – the Log Token for the Gaia-X Data Exchange Logging Service
   * @param dataAsset
   * @returns
   */
  async getLogToken(dataAsset: DataAsset): Promise<string> {
    const logToken = await this.logTokenAdapter.getLogToken(dataAsset);
    return this.jwtService.sign(logToken);
  }

  /**
   * The GX-DCS evaluates the finalized Agreement and returns whether a finalized Agreement is valid or not,
   * including a humanreadable explanation.
   * @param logToken
   * @returns
   */
  async validate(logToken: string): Promise<LogToken> {
    return this.jwtService.verify(logToken);
  }
}
