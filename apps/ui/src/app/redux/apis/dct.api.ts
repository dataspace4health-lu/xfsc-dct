import { createApi } from '@reduxjs/toolkit/query/react';
import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import { RootState } from '../store';
import { AuthToken, ErrorResponse, ValidationErrorResponse } from '@dct/common';

export const isValidationErrorResponse = (response: any): response is ValidationErrorResponse => {
  return response.error === 'Bad Request' && Array.isArray(response.message);
};

export const isServerErrorResponse = (response: any): response is ErrorResponse => {
  return parseInt(response.statusCode) >= 400 && typeof response.message === 'string';
};

export const dctApiSlice = createApi({
  reducerPath: 'dct/api',

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NX_API_ENDPOINT,
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
        body: JSON.stringify(credentials),
        headers: {
          'Content-Type': 'application/ld+json',
        },
      }),
    }),
  }),
});

// Export the auto-generated hook for the `getPosts` query endpoint
export const { useLoginMutation } = dctApiSlice;
