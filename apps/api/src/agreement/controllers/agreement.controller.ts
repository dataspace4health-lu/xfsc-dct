import { Body, Controller, HttpCode, Post, Res } from "@nestjs/common";
import { DataAssetPresentation } from "../dtos/data-asset.dto";
import { AgreementService } from "../services/agreement.service";


@Controller()
export class AgreementController {

    constructor(private readonly agreementService: AgreementService) { }

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
    async validate(@Body() dataAsset: DataAssetPresentation, @Res() res) {
         await this.agreementService.validate(dataAsset);
    }

    @Post('/log/token')
    async logToken(@Body() dataAsset: DataAssetPresentation) {
        return this.agreementService.logToken(dataAsset);
    }

}