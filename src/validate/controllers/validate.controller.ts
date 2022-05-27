import {
  Body,
  Controller,
  Post,
  UseGuards
} from '@nestjs/common';
import { TokenAuthGuard } from 'src/auth/guards/token.guard';
import { ContractDto } from 'Gateways/dtos/contract.dto'
import { ValidateService } from '../services/validate.service';

@UseGuards(TokenAuthGuard)
@Controller('validate')
export class ValidateController {
  constructor(private readonly appService: ValidateService) {}

  @Post('')
  create(@Body() validateDto: ContractDto) {
      return this.appService.create(validateDto);
  }
}
