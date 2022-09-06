import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigType } from '../../config/config.module';
import { InboxDto } from '../../gateways/dtos/inbox.dto';

@Injectable()
export class UtilsService {

  constructor(private readonly configService: ConfigService<ConfigType>){}

  async getInboxDiscovery(): Promise<InboxDto> {
    return this.configService.get('dels', {infer:true})
  }
}
