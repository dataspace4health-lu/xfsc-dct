import { HttpException } from '@nestjs/common';

export class UnauthorizedException extends HttpException {
  constructor(message: string) {
    super(`Not found – ${message}`, 404);
  }
}
