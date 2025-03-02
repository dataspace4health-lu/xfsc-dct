import { UserManagerSettings, WebStorageStateStore } from 'oidc-client-ts';

export const oidcSettings: UserManagerSettings = {
    authority: String(process.env.NX_OIDC_ISSUER),
    client_id: String(process.env.NX_OIDC_CLIENT_ID),
    client_secret: String(process.env.NX_OIDC_CLIENT_SECRET),
    redirect_uri: String(process.env.NX_OIDC_REDIRECT_URI),
    post_logout_redirect_uri: String(process.env.NX_OIDC_POST_LOGOUT_REDIRECT_URI),
    response_type: String(process.env.NX_OIDC_RESPONSE_TYPE),
    scope: String(process.env.NX_OIDC_SCOPE),
    disablePKCE: false,
    userStore: new WebStorageStateStore({ store: window.localStorage }),
};