import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ContractDto } from 'Gateways/dtos/contract.dto';
import { TokenAuthGuard } from 'src/auth/guards/token.guard';
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
