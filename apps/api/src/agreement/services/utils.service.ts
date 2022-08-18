import { Injectable } from '@nestjs/common';
import { InboxDto } from '../../gateways/dtos/inbox.dto';

@Injectable()
export class UtilsService {
  constructor() {}

  async getInboxDiscovery(): Promise<InboxDto> {
    const headInboxDto: InboxDto = new InboxDto();
    headInboxDto['@context'] = process.env.DELS_CONTEXT;
    headInboxDto['@id'] = process.env.DELS_ID;
    headInboxDto['inbox'] = process.env.DELS_INBOX;
    headInboxDto['link'] = process.env.DELS_LINK;
    headInboxDto['rel'] = process.env.DELS_REL;
    return headInboxDto;
  }
}
