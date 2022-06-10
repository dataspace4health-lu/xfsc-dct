import { createApi } from '@reduxjs/toolkit/query/react';
import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import { RootState } from '../store';
import { ErrorResponse, ValidationErrorResponse } from '../../../../src/declarations/admin';

export const isValidationErrorResponse = (response: any): response is ValidationErrorResponse => {
  return response.error === 'Bad Request' && Array.isArray(response.message);
};

export const isServerErrorResponse = (response: any): response is ErrorResponse => {
  return parseInt(response.statusCode) >= 400 && typeof response.message === 'string';
};

export const dctApiSlice = createApi({
  reducerPath: 'dct/api',

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
    register: builder.mutation({
      query: (credentials) => ({
        url: '/register',
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
});

// Export the auto-generated hook for the `getPosts` query endpoint
export const { useRegisterMutation } = dctApiSlice;
