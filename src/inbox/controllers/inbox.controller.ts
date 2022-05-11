import { Controller, Request, Post, UseGuards, Get } from '@nestjs/common';
import { TokenAuthGuard } from 'Auth/guards/token.guard';
import { InboxService } from '../services/inbox.service';

@Controller('inbox')
@UseGuards(TokenAuthGuard)
export class InboxController {
    constructor(private readonly inboxService: InboxService) {}

    @Get()
    async getNotification(@Request() req): Promise<any> {
        return true;
    }

    @Post()
    async processNotification(@Request() req): Promise<any> {
        return true;
    }
}
