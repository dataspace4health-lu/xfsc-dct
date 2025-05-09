import { registerAs } from '@nestjs/config';

const loader = () => ({
    isDevelopment: Boolean(process.env.NODE_ENV === 'development'),
    port: parseInt(process.env.NX_API_PORT) || 3000,
    basePath: process.env.NX_API_BASEPATH || '',

    cache: {
        store: process.env.CACHE_TYPE,
        ttl: parseInt(process.env.CACHE_TTL),
    },

    sdCacheTTL: parseInt(process.env.SD_CACHE_TTL),
    sdQueueDelay: parseInt(process.env.SD_QUEUE_DELAY),
    sdQueueRetry: parseInt(process.env.SD_QUEUE_RETRIES),
    requestSize: parseInt(process.env.REQUEST_SIZE)
});

export type ConfigType = {
    general: ReturnType<typeof loader>;
};

export default registerAs('general', loader);
