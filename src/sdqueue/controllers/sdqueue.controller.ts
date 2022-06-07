import { InjectQueue } from "@nestjs/bull";
import { Controller, Post } from "@nestjs/common";
import { Queue } from "bull";

@Controller('sdqueue')
export class SdqueueController {
  constructor(@InjectQueue('processSds') private readonly sdsQueue: Queue) {}

  @Post('processSds')
  async processSds() {
    await this.sdsQueue.add('processSds', {

    })
  }
}