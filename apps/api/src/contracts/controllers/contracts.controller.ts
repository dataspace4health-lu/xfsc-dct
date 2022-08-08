import { Controller, Get, Head, HttpCode, UseGuards } from '@nestjs/common';
import { TokenAuthGuard } from '../../auth/guards/token.guard';
import { ContractsService } from '../services/contracts.service';

@UseGuards(TokenAuthGuard)
@Controller('contracts')
export class ContractsController {
  constructor(private readonly appService: ContractsService) {}

  @Get('')
  @HttpCode(200)
  async get() {
    return await this.appService.get();
  }
  @Head('')
  @HttpCode(200)
  async head() {
    return await this.appService.head();
  }
}
