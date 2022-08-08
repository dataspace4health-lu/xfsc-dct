import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { TokenAuthGuard } from '../../auth/guards/token.guard';
import { ContractDto } from '../../gateways/dtos/contract.dto';
import { FinalizeService } from '../services/finalize.service';

@UseGuards(TokenAuthGuard)
@Controller('finalize')
export class FinalizeController {
  constructor(private readonly appService: FinalizeService) {}

  @Post('')
  async create(@Body() finalizeDto: ContractDto) {
    return await this.appService.create(finalizeDto);
  }
}
