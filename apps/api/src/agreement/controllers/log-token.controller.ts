import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { LogToken } from "../dtos/log-token.dto";
import { ValidateLogTokenDto } from "../dtos/validate-log-token.dto";
import { LogTokenService } from "../services/log-token.service";

@Controller()
export class LogTokenController {

    constructor(private logTokenService: LogTokenService) { }

    @ApiOperation({
        summary: `Endpoint for validation of a provided Log Token.`,
    })
    @ApiResponse({
        status: 200,
        description: `Decoded Log Token`,
        type: LogToken
    })
    @ApiResponse({
        status: 401,
        description:
            `Unauthorized – invalid signature provided`,
    })
    @ApiBody({
        description: `Signed Log Token`
    })
    @Post('/log/token/validate')
    @HttpCode(200)
    async validateLogToken(@Body() dto: ValidateLogTokenDto): Promise<LogToken> {
        return this.logTokenService.validate(dto.logToken);
    }
}