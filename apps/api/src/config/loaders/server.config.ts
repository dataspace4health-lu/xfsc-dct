import { registerAs } from '@nestjs/config';

const loader = () => ({
    throtller: {
        ttl: parseInt(process.env.SERVER_THROTLLER_TTL),
        limit: parseInt(process.env.SERVER_THROTLLER_LIMIT),
    },
});

export type ConfigType = {
    server: ReturnType<typeof loader>;
};

export default registerAs('server', loader);
