import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { TokenAuthGuard } from '../../auth/guards/token.guard';
import { ContractDto } from '../../gateways/dtos/contract.dto';
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
