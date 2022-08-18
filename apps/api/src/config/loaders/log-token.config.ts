import { registerAs } from '@nestjs/config';

const loader = () => ({
    secret: process.env.LOG_TOKEN_JWT_SECRET_KEY,
    expiresIn: Number(process.env.LOG_TOKEN_EXPIRES_IN_MINUTES) * 60,
});

export type ConfigType = {
    logToken: ReturnType<typeof loader>;
};

export default registerAs('logToken', loader);
