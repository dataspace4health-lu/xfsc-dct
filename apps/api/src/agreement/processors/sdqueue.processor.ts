import { Process, Processor } from "@nestjs/bull";
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, Inject } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Job } from "bull";
import { ConfigType } from "../../config/config.module";

@Processor('{processSds}')
export class SdqueueProcessor {
  public constructor(
    readonly configService: ConfigService<ConfigType>,
    @Inject(CACHE_MANAGER) protected cache: Cache) { }

  @Process('sds')
  async handleProcessSds(job: Job) {
    console.log(job.id);
    console.log('Start processing notification...', job.data);
    console.log(job.data);
    console.log('Processing complete');

    const data = JSON.parse(job.data);
    const sdID = data['VerifiableCredential']['credentialSubject']['id'];
    const cachedSD = await this.cache.get(sdID);

    if (cachedSD !== undefined && cachedSD !== null) {
      return this.cache.set(sdID, data);
    }

    return job.remove();
  }
}