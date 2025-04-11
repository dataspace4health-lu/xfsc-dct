import { registerAs } from '@nestjs/config';

const loader = () => ({
    didResolverService: process.env.DID_RESOLVER_SERVICE_URL,
    federatedCatalog: process.env.FEDERATED_CATALOG_URL,
});

export type ConfigType = {
    gateway: ReturnType<typeof loader>;
};

export default registerAs('gateway', loader);
