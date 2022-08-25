import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { DataAssetPresentation } from '../dtos/data-asset.dto';
import { ValidateLogTokenDto } from '../dtos/validate-log-token.dto';
import { AgreementService } from '../services/agreement.service';
import { LogTokenService } from '../services/log-token.service';
import { UtilsService } from '../services/utils.service';

@Controller()
export class AgreementController {
  constructor(
    private readonly agreementService: AgreementService,
    private logTokenService: LogTokenService,
    private utilsService: UtilsService,
  ) {}

  @Post('/register')
  async register(@Body() dataAsset: DataAssetPresentation) {
    return this.agreementService.register(dataAsset);
  }

  @Post('/make/contract')
  async makeContract(@Body() dataAsset: DataAssetPresentation) {
    return this.agreementService.makeContract(dataAsset);
  }

  @Post('/negotiate')
  async negotiate(@Body() dataAsset: DataAssetPresentation) {
    return this.agreementService.negotiate(dataAsset);
  }

  @Post('/finalize')
  async finalize(@Body() dataAsset: DataAssetPresentation) {
    return this.agreementService.finalize(dataAsset);
  }

  @Post('/validate')
  @HttpCode(200)
  async validate(@Body() dataAsset: DataAssetPresentation) {
    return this.agreementService.validate(dataAsset);
  }

  @Post('/log/token')
  async logToken(@Body() dataAsset: DataAssetPresentation) {
    return this.agreementService.logToken(dataAsset);
  }

  @Post('/log/token/validate')
  @HttpCode(200)
  async validateLogToken(@Body() dto: ValidateLogTokenDto) {
    return this.logTokenService.validate(dto.logToken);
  }

  @Get('/contracts/inbox-discovery')
  @HttpCode(200)
  async inboxDiscovery() {
    return this.utilsService.getInboxDiscovery();
  }
}
