import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { TokenAuthGuard } from '../../auth/guards/token.guard';
import { ContractDto } from '../../gateways/dtos/contract.dto';
import { NegotiateService } from '../services/negotiate.service';

@UseGuards(TokenAuthGuard)
@Controller('negotiate')
export class NegotiateController {
  constructor(private readonly appService: NegotiateService) {}

  @Post('')
  async create(@Body() negotiateDto: ContractDto) {
    return await this.appService.create(negotiateDto);
  }
}
