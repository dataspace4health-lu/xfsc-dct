import * as Joi from 'joi';
import { LoggerType } from '../global/logs/logger.provider';

export default Joi.object({
    NODE_ENV: Joi.string().valid('development', 'production').default('production'),

    SERVER_THROTLLER_TTL: Joi.number().integer().min(1).max(300).default(60),
    SERVER_THROTLLER_LIMIT: Joi.number().integer().min(1).default(10),

    LOGGER_TYPE: Joi.string()
        .valid(...Object.values(LoggerType))
        .default('console'),
    LOGGER_WINSTON_LEVEL: Joi.string().valid('debug', 'info', 'warn', 'error').default('info'),
    LOGGER_WINSTON_TRANSPORTS_CONSOLE: Joi.boolean().default(true),
    LOGGER_WINSTON_TRANSPORTS_FILE: Joi.string().default('logs/app.log'),

    CACHE_TYPE: Joi.string().valid('redis', 'memory').default('memory'),
    CACHE_TTL: Joi.number().default(300),

    REDIS_HOST: Joi.string().when('CACHE_TYPE', {
        is: 'redis',
        then: Joi.required(),
        otherwise: Joi.optional().allow(''),
    }),
    REDIS_PASSWORD: Joi.string().optional(),
    REDIS_PORT: Joi.number().default(6379),
    REDIS_PREFIX: Joi.string().default('cache'),
    REDIS_TYPE: Joi.string().valid('node', 'cluster').default('node'),

    TRUST_SERVICE_URL: Joi.string().uri().required(),
    FEDERATED_CATALOG_URL: Joi.string().uri().required(),

    SIGNATURE_ID: Joi.string().required(),
    SIGNATURE_CONTROLLER: Joi.string().required(),
    SIGNATURE_TYPE: Joi.string().required(),
    SIGNATURE_PUBLIC_KEY_BASE58: Joi.string().required(),
    SIGNATURE_PRIVATE_KEY_BASE58: Joi.string().required(),

    LOG_TOKEN_JWT_SECRET_KEY: Joi.string().required(),
    LOG_TOKEN_EXPIRES_IN_MINUTES: Joi.number().integer().min(1).required(),

    DELS_CONTEXT:Joi.string().optional(),
    DELS_ID:Joi.string().optional(),
    DELS_INBOX: Joi.string().uri(),
    DELS_LINK: Joi.string().uri(),
    DELS_REL: Joi.string().uri()
});
