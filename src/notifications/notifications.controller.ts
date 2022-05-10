import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from 'src/auth/guards/local.guard';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) {}

    @UseGuards(LocalAuthGuard)
    @Post()
    async processNotification(@Request() req): Promise<any> {
        return true;
    }
}
