import { createApi } from '@reduxjs/toolkit/query/react';
import { BaseQueryFn, FetchArgs, fetchBaseQuery, FetchBaseQueryMeta } from '@reduxjs/toolkit/query';
import { RootState } from '../store';
import { AuthToken, ErrorResponse, ValidationErrorResponse } from '@dct/common';
import { setAuthToken } from '../slices/auth.slice';
import { QueryReturnValue } from '@reduxjs/toolkit/dist/query/baseQueryTypes';

const dctBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NX_API_ENDPOINT,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token.accessToken}`);
    }
    return headers;
  },
});

const dctQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  ErrorResponse | ValidationErrorResponse
> = async (args, api, extraOptions) => {
  let result = await dctBaseQuery(args, api, extraOptions);
  if (result.error) {
    if (
      result.error.status === 401 &&
      (args as FetchArgs).url !== '/auth/login'
    ) {
      api.dispatch(setAuthToken());
    }
    return {
      ...result,
      error: result.error.data,
    } as QueryReturnValue<
      unknown,
      ErrorResponse | ValidationErrorResponse,
      FetchBaseQueryMeta
    >;
  }
  return result as QueryReturnValue<
    unknown,
    ErrorResponse | ValidationErrorResponse,
    FetchBaseQueryMeta
  >;
};

export const dctApiSlice = createApi({
  reducerPath: 'dct/api',
  baseQuery: dctQuery,
  endpoints: (builder) => ({
    login: builder.mutation<AuthToken, { username: string; password: string }>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    }),
    register: builder.mutation<any, any>({
      query: contract => ({
        url: '/register',
        method: 'POST',
        body: JSON.stringify(contract),
        headers: {
          'Content-Type': 'application/ld+json',
        }
      })
    })
  }),
});

// Export the auto-generated hook for the `getPosts` query endpoint
export const { useLoginMutation, useRegisterMutation } = dctApiSlice;
