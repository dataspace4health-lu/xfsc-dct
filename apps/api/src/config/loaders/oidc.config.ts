import { registerAs } from '@nestjs/config';

const loader = () => ({
    issuer: process.env.NX_OIDC_ISSUER,
    clientId: process.env.NX_OIDC_CLIENT_ID,
    clientSecret: process.env.NX_OIDC_CLIENT_SECRET,
    scope: process.env.NX_OIDC_SCOPE,
    redirectUri: process.env.NX_OIDC_REDIRECT_URI,
    postLogoutRedirectUri: process.env.NX_OIDC_POST_LOGOUT_REDIRECT_URI,
});

export type ConfigType = {
    oidc: ReturnType<typeof loader>;
};

export default registerAs('oidc', loader);
