import { Process, Processor } from "@nestjs/bull";
import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Job } from "bull";
import { ConfigType } from "Config/config.module";

@Processor('processSds')
export class SdqueueProcessor {
  public constructor(
    private readonly logger: Logger,
    readonly configService: ConfigService<ConfigType>) {}

  @Process('sds')
  handleProcessSds(job: Job) {
    this.logger.debug('Start processing notification...', job.data);
    this.logger.debug(job.data);
    this.logger.debug('Processing complete');

    console.log('Start processing notification...', job.data);
    console.log(job.data);
    console.log('Processing complete');
  }
}