import {
  Body,
  Controller,
  Post,
  UseGuards
} from '@nestjs/common';
import { TokenAuthGuard } from 'src/auth/guards/token.guard';
import { ValidateDto } from '../dtos/validate.dto';
import { ValidateService } from '../services/validate.service';

@UseGuards(TokenAuthGuard)
@Controller('validate')
export class ValidateController {
  constructor(private readonly appService: ValidateService) {}

  @Post('')
  create(@Body() validateDto: ValidateDto): ValidateDto {
      return this.appService.create(validateDto);
  }
}
