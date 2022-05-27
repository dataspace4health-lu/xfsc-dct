import {
  Body,
  Controller,
  Post,
  UseGuards
} from '@nestjs/common';
import { ContractDto } from 'Common/dtos/contract.dto';
import { TokenAuthGuard } from 'src/auth/guards/token.guard';
import { LogTokenService } from '../services/log-token.service';

@UseGuards(TokenAuthGuard)
@Controller('log')
export class LogTokenController {
  constructor(private readonly appService: LogTokenService) {}

  @Post('token')
  create(@Body() logTokenDto: ContractDto) {
    return this.appService.create(logTokenDto);
  }
}
