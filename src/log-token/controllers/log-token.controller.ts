import {
  Body,
  Controller,
  Post,
  UseGuards
} from '@nestjs/common';
import { TokenAuthGuard } from 'src/auth/guards/token.guard';
import { LogTokenDto } from '../dtos/log-token.dto';
import { LogTokenService } from '../services/log-token.service';

@UseGuards(TokenAuthGuard)
@Controller('log')
export class RegisterController {
  constructor(private readonly appService: LogTokenService) {}

  @Post('token')
  create(@Body() logTokenDto: LogTokenDto) {
    return this.appService.create(logTokenDto);
  }
}
