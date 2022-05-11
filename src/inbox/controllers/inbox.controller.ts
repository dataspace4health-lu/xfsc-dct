import { Controller, Request, Post, UseGuards, Get } from '@nestjs/common';
import { LocalAuthGuard } from 'src/auth/guards/local.guard';
import { TokenAuthGuard } from 'src/auth/guards/token.guard';
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
