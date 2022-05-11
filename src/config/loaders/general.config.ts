import { registerAs } from '@nestjs/config';

const loader = () => ({
    isDevelopment: Boolean(process.env.NODE_ENV === 'development'),
    cache: {
        store: process.env.CACHE_TYPE,
        ttl: parseInt(process.env.CACHE_TTL),
    },
    token: process.env.AUTH_TOKEN,
});

export type ConfigType = {
    general: ReturnType<typeof loader>;
};

export default registerAs('general', loader);
