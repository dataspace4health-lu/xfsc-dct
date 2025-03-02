import { registerAs } from '@nestjs/config';

const loader = () => ({
    issuer: process.env.OIDC_ISSUER,
    clientId: process.env.OIDC_CLIENT_ID,
    clientSecret: process.env.OIDC_CLIENT_SECRET,
    scope: process.env.OIDC_SCOPE,
    redirectUri: process.env.OIDC_REDIRECT_URI,
    postLogoutRedirectUri: process.env.OIDC_POST_LOGOUT_REDIRECT_URI,
});

export type ConfigType = {
    oidc: ReturnType<typeof loader>;
};

export default registerAs('oidc', loader);
