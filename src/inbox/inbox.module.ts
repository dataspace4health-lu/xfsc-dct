import { Module } from '@nestjs/common';
import { InboxController } from './inbox.controller';
import { InboxService } from './inbox.service';

@Module({
    providers: [InboxService],
    controllers: [InboxController],
})
export class InboxModule {}
