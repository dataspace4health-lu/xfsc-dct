import { registerAs } from '@nestjs/config';

const loader = () => ({
    trustService: process.env.TRUST_SERVICE_URL,
    federatedCatalog: process.env.FEDERATED_CATALOG_URL,
});

export type ConfigType = {
    gateway: ReturnType<typeof loader>;
};

export default registerAs('gateway', loader);
