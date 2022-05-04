import * as Joi from 'joi';
import { LoggerType } from 'src/global/logs/logger.provider';

export default Joi.object({
    NODE_ENV: Joi.string().valid('development', 'production').default('production'),
    APP_ENDPOINT: Joi.string().uri().default('http://localhost:3000'),

    DATABASE_HOST: Joi.string().required(),
    DATABASE_PORT: Joi.number().default(5432),
    DATABASE_USER: Joi.string().required(),
    DATABASE_PASSWORD: Joi.string().required(),
    DATABASE_DATABASE: Joi.string().required(),

    LOGGER_TYPE: Joi.string().valid(...Object.values(LoggerType)).default('console'),
    LOGGER_WINSTON_LEVEL: Joi.string().valid('debug', 'info', 'warn', 'error').default('info'),
    LOGGER_WINSTON_TRANSPORTS_CONSOLE: Joi.boolean().default(true),
    LOGGER_WINSTON_TRANSPORTS_FILE: Joi.string().default('logs/app.log'),
});