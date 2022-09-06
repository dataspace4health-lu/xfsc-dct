import { registerAs } from '@nestjs/config';

const loader = () => ({
    '@context': process.env.DELS_CONTEXT,
    '@id': process.env.DELS_ID,
    'inbox': process.env.DELS_INBOX,
    'link': process.env.DELS_LINK,
    'rel': process.env.DELS_REL
});

export type ConfigType = {
    dels: ReturnType<typeof loader>;
};

export default registerAs('dels', loader);