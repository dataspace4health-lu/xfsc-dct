import { createApi } from '@reduxjs/toolkit/query/react';
import { BaseQueryFn, FetchArgs, fetchBaseQuery } from '@reduxjs/toolkit/query';
import { RootState } from '../store';
import { AuthToken, ErrorResponse, ValidationErrorResponse } from '../../../../src/declarations/admin';
import { type } from 'os';

export const isValidationErrorResponse = (response: any): response is ValidationErrorResponse => {
    return response.error === 'Bad Request' && Array.isArray(response.message);
};

export const isServerErrorResponse = (response: any): response is ErrorResponse => {
    return parseInt(response.statusCode) >= 400 && typeof response.message === 'string';
};

export const delApiSlice = createApi({
    reducerPath: 'del/api',

    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_SERVER_ENDPOINT,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.token;
            if (token) {
                headers.set('Authorization', `Bearer ${token.accessToken}`);
            }
            return headers;
        },
    }),

    endpoints: (builder) => ({
        login: builder.mutation<AuthToken, { username: string; password: string }>({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
        }),
    }),
});

// Export the auto-generated hook for the `getPosts` query endpoint
export const { useLoginMutation } = delApiSlice;
