import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";

@Processor('processSds')
export class SdqueueProcessor {
  @Process('processSds')
  handleProcessSds(job: Job) {
    // consumer
  }
}