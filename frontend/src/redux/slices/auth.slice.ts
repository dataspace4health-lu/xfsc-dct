import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthToken } from '../../../../src/declarations/admin';
import { delApiSlice } from '../apis/del.api';

export interface AuthSlice {
    token?: AuthToken;
}

const initialState: AuthSlice = {};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuthToken: (state, action: PayloadAction<AuthToken | undefined>) => {
            state.token = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(delApiSlice.endpoints.login.matchFulfilled, (state, action) => {
            state.token = action.payload;
        });
    },
});

export const { setAuthToken } = authSlice.actions;
export default authSlice;
