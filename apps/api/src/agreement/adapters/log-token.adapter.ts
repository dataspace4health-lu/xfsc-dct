import { Injectable } from '@nestjs/common';
import { AbstractLogTokenAdapter, } from '.';
import { DataAsset } from '../dtos/data-asset.dto';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { ConfigType } from '../../config/config.module';
import * as moment from 'moment';
import { LogToken } from '../dtos/log-token.dto';

@Injectable()
export class LogTokenAdapter extends AbstractLogTokenAdapter {
  constructor(private readonly configService: ConfigService<ConfigType>) {
    super();
  }

  /**
   * Returns a Log Token which authenticates access at GX-DELS.
   * @param dataAsset
   * @returns
   */
  async getLogToken(dataAsset: DataAsset): Promise<LogToken> {
    const logID = uuidv4();

    const logToken = {
      'gax-dcs:logID': logID,
      'gax-dcs:dataTransactionID': '123',
      'gax-dcs:contractID': dataAsset['@id'],
      iss: '(Logging service ID)',
      sub: '(Participant ID)',
      aud: '(GX-DELS identifier)',
      exp: moment()
        .add(this.configService.get('logToken.expiresIn', { infer: true }), 'minutes')
        .unix(),
    };
    return logToken;
  }

  /**
   * Verifies if Service is healthy
   * @returns
   */
  async isHealthy(): Promise<boolean> {
    return true;
  }
}
