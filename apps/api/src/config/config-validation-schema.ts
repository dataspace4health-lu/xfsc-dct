import * as Joi from 'joi';
import { LoggerType } from '../global/logs/logger.provider';

export default Joi.object({
    NODE_ENV: Joi.string().valid('development', 'production').default('production'),
    AUTH_TOKEN: Joi.string().required(),

    SERVER_ENDPOINT: Joi.string().uri().default('http://localhost:3000'),
    SERVER_THROTLLER_TTL: Joi.number().integer().min(1).max(300).default(60),
    SERVER_THROTLLER_LIMIT: Joi.number().integer().min(1).default(10),

    ADMIN_USERNAME: Joi.string().required(),
    ADMIN_PASSWORD: Joi.string().required(),
    ADMIN_JWT_SECRET_KEY: Joi.string().required(),
    ADMIN_JWT_EXPIRES_IN_MINUTES: Joi.number().integer().min(1).required(),

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
    REDIS_PORT: Joi.number().default(6379),
    REDIS_PREFIX: Joi.string().default('cache'),
});
