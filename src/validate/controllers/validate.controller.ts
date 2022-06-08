import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ContractDto } from 'Gateways/dtos/contract.dto';
import { TokenAuthGuard } from 'src/auth/guards/token.guard';
import { ValidateService } from '../services/validate.service';

@UseGuards(TokenAuthGuard)
@Controller('validate')
export class ValidateController {
  constructor(private readonly appService: ValidateService) {}

  @Post('')
  async create(@Body() validateDto: ContractDto) {
    return await this.appService.create(validateDto);
  }
}
