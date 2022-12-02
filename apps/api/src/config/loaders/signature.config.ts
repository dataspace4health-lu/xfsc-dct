import { registerAs } from '@nestjs/config';

const loader = () => ({
    "id": process.env.SIGNATURE_ID,
    "controller": process.env.SIGNATURE_CONTROLLER,
    "type": process.env.SIGNATURE_TYPE,
    "publicKeyBase58": process.env.SIGNATURE_PUBLIC_KEY_BASE58,
    "privateKeyBase58": process.env.SIGNATURE_PRIVATE_KEY_BASE58,
});

export type ConfigType = {
    signature: ReturnType<typeof loader>;
};

export default registerAs('signature', loader);
