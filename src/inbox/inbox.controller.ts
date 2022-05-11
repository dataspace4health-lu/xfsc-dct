import { Controller, Request, Post, UseGuards, Get } from '@nestjs/common';
import { LocalAuthGuard } from 'src/auth/guards/local.guard';
import { InboxService } from './inbox.service';

@Controller('inbox')
export class InboxController {
    constructor(private readonly inboxService: InboxService) {}

    @UseGuards(LocalAuthGuard)
    @Get()
    async getNotification(@Request() req): Promise<any> {
        return true;
    }

    @UseGuards(LocalAuthGuard)
    @Post()
    async processNotification(@Request() req): Promise<any> {
        return true;
    }
}
