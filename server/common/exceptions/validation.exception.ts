import { HttpException } from '@nestjs/common';

export class ValidationException extends HttpException {
  constructor(message: string, code: number) {
    super(`Forbidden – ${message}`, code);
  }
}
