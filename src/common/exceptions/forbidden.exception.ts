import { HttpException, HttpStatus } from '@nestjs/common';

export class ForbiddenException extends HttpException {
  constructor(message?: string | undefined) {
    message && super(`Forbidden – ${message}`, HttpStatus.FORBIDDEN);
    !message && super(`Forbidden`, HttpStatus.FORBIDDEN);
  }
}
