import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { TokenAuthGuard } from 'src/auth/guards/token.guard';
import { RegisterDto } from '../dtos/register.dto';
import { RegisterService } from '../services/register.service';

@UseGuards(TokenAuthGuard)
@Controller('register')
export class RegisterController {
  constructor(private readonly appService: RegisterService) {}

  @Post('')
  async create(@Body() registerDto: RegisterDto) {
    return await this.appService.create(registerDto);
  }
}
