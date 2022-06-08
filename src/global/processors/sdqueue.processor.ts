import { Process, Processor } from "@nestjs/bull";
import { Logger } from "@nestjs/common";
import { Job } from "bull";

@Processor('processSds')
export class SdqueueProcessor {
  @Process()
  handleProcessSds(job: Job) {
    console.log('Start processing notification...', job.data);
    console.log(job.data);
    console.log('Processing complete');
  }
}