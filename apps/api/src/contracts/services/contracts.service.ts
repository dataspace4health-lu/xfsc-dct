import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigType } from '../../config/config.module';
import { InboxDto } from '../../gateways/dtos/inbox.dto';
import { CommonGateway } from '../../global/gateways/common.gateway';

@Injectable()
export class ContractsService {
  public constructor(protected readonly configService: ConfigService<ConfigType>, protected commonApi: CommonGateway) {}

  /**
   *
   * Discovers inbox on GET request
   * @return string
   */
  async get() {
    return process.env.DELS_LINK + '; ' + process.env.DELS_REL;
  }

  /**
   *
   * Discovers inbox on HEAD request
   * @return inboxDto
   */
  async head() {
    const headInboxDto: InboxDto = new InboxDto();
    headInboxDto['@context'] = process.env.DELS_CONTEXT;
    headInboxDto['@id'] = process.env.DELS_ID;
    headInboxDto['inbox'] = process.env.DELS_INBOX;
    const test = 'heree';
    return test;
  }
}
