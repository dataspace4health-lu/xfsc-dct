import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { TokenAuthGuard } from 'src/auth/guards/token.guard';
import { ContractDto } from 'Gateways/dtos/contract.dto';
import { LogTokenService } from '../services/log-token.service';

@UseGuards(TokenAuthGuard)
@Controller('log')
export class LogTokenController {
  constructor(private readonly appService: LogTokenService) {}

  @Post('token')
  async create(@Body() logTokenDto: ContractDto) {
    return await this.appService.create(logTokenDto);
  }
}
