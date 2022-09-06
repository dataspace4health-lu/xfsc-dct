import { Controller, Get, HttpCode } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { InboxDto } from "../../gateways/dtos/inbox.dto";
import { UtilsService } from "../services/utils.service";

@Controller()
export class UtilsController {

    constructor(private utilsService: UtilsService) { }
    
    @ApiOperation({
        summary: `Endpoint for retrieving DELS discovery information`,
    })
    @ApiResponse({
        status: 200,
        description: `DELS discory information`,
        type: InboxDto
    })
    @Get('/contracts/inbox-discovery')
    @HttpCode(200)
    async inboxDiscovery() {
        return this.utilsService.getInboxDiscovery();
    }
}