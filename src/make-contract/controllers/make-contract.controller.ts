import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { TokenAuthGuard } from 'src/auth/guards/token.guard';
import { ContractDto } from 'Gateways/dtos/contract.dto';
import { MakeContractService } from '../services/make-contract.service';

@UseGuards(TokenAuthGuard)
@Controller('make')
export class MakeContractController {
  constructor(private readonly appService: MakeContractService) {}

  @Post('contract')
  async create(@Body() contractDto: ContractDto) {
    return await this.appService.create(contractDto);
  }
}
