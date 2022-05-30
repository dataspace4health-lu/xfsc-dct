import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ContractDto } from 'Gateways/dtos/contract.dto';
import { TokenAuthGuard } from 'src/auth/guards/token.guard';
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
