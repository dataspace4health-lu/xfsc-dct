import { registerAs } from '@nestjs/config';

const loader = () => ({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  prefix: process.env.REDIS_PREFIX,
  password: process.env.REDIS_PASSWORD
});

export type ConfigType = {
  redis: ReturnType<typeof loader>;
};

export default registerAs('redis', loader);
