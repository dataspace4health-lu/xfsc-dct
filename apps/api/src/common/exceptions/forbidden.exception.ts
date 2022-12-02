import { HttpException, HttpStatus } from '@nestjs/common';

function getForbiddenMessage(message?: string) {
  return `Forbidden${message ? ` - ` + message : ''}`;
}

export class ForbiddenException extends HttpException {
  constructor(message?: string | undefined) {
    super(getForbiddenMessage(message), HttpStatus.FORBIDDEN);
  }
}
