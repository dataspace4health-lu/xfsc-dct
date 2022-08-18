import { Injectable } from '@nestjs/common';
import { DataAsset } from '../dtos/data-asset.dto';
import { JwtService } from '@nestjs/jwt';
import { AbstractLogTokenAdapter, LogToken } from '../adapters';

@Injectable()
export class LogTokenService {
  constructor(private readonly logTokenAdapter: AbstractLogTokenAdapter, private readonly jwtService: JwtService) {}

  async getLogToken(dataAsset: DataAsset): Promise<string> {
    const logToken = await this.logTokenAdapter.getLogToken(dataAsset);
    return this.jwtService.sign(logToken);
  }

  async validate(logToken: string): Promise<LogToken> {
    return await this.jwtService.verify(logToken);
  }
}
