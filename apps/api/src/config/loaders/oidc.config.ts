import { registerAs } from '@nestjs/config';

const loader = () => ({
    issuer: process.env.OIDC_ISSUER,
    path: process.env.OIDC_PATH,
});

export type ConfigType = {
    oidc: ReturnType<typeof loader>;
};

export default registerAs('oidc', loader);
