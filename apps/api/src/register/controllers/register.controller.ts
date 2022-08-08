import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { TokenAuthGuard } from '../../auth/guards/token.guard';
import { ContractDto } from '../../gateways/dtos/contract.dto';
import { RegisterService } from '../services/register.service';

@UseGuards(TokenAuthGuard)
@Controller('register')
export class RegisterController {
  constructor(private readonly appService: RegisterService) {}

  @Post('')
  async create(@Body() registerDto: ContractDto) {
    return await this.appService.create(registerDto);
  }
}
