import { registerAs } from "@nestjs/config";

const loader = () => ({
    isDevelopment: Boolean(process.env.NODE_ENV === 'development'),
    appUrl: process.env.APP_ENDPOINT
});

export type ConfigType = {
    general: ReturnType<typeof loader>
};

export default registerAs('general', loader);