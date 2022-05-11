import { Module } from '@nestjs/common';
import { InboxController } from './controllers/inbox.controller';
import { InboxService } from './services/inbox.service';
@Module({
    providers: [InboxService],
    controllers: [InboxController],
})
export class InboxModule {}
