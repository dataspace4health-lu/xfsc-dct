import { HttpException } from '@nestjs/common';

export class RedisException extends HttpException {
  constructor() {
    super(`Redis is down – ${process.env.REDIS_PORT}`, 500);
  }
}
