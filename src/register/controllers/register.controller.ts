import {
  Body,
  Controller,
  Post,
  UseGuards
} from '@nestjs/common';
import { TokenAuthGuard } from 'src/auth/guards/token.guard';
import { RegisterDto } from '../dtos/register.dto';
import { RegisterService } from '../services/register.service';

@UseGuards(TokenAuthGuard)
@Controller('register')
export class RegisterController {
  constructor(private readonly appService: RegisterService) {}

  @Post('')
  create(@Body() registerDto: RegisterDto): RegisterDto {
      return this.appService.create(registerDto);
  }
}
