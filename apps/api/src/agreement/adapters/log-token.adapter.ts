import { Injectable } from "@nestjs/common";
import { AbstractLogTokenAdapter, LogToken } from ".";
import { DataAsset } from "../dtos/data-asset.dto";
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from "@nestjs/config";
import { ConfigType } from "../../config/config.module";
import * as moment from "moment";

@Injectable()
export class LogTokenAdapter extends AbstractLogTokenAdapter {

    constructor(private readonly configService: ConfigService<ConfigType>) { 
        super();
    }

    async getLogToken(dataAsset: DataAsset): Promise<LogToken> {
        const logID = uuidv4();

        const logToken = {
            'gax-dcs:logID': logID,
            'gax-dcs:dataTransactionID': '123',
            'gax-dcs:contractID': dataAsset['@id'],
            iss: '(Logging service ID)',
            sub: '(Participant ID)',
            aud: '(GX-DELS identifier)',
            exp: moment().add(this.configService.get('logToken.expiresIn', { infer: true }), 'minutes').unix(),
        };
        return logToken
    }
}