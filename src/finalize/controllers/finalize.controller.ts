import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ContractDto } from '../../gateways/dtos/contract.dto';
import { TokenAuthGuard } from 'src/auth/guards/token.guard';
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
