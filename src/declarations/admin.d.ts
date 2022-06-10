import { ValidationErrorResponse } from 'src/main/exceptions/validation.exception-filter';
import { ErrorResponse } from 'src/main/exceptions/http-exception.filter';

export type AuthToken = {
    accessToken: string;
    expiresAt?: number;
};

export { ErrorResponse, ValidationErrorResponse };
