import React from 'react';
import { useLoginMutation } from '../../redux/apis/dct.api';
import { useNavigate } from 'react-router-dom';
import { Credentials, SignIn } from '../../components/sign-in';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { useLocation } from '../../hooks/use-location';
import styles from './login-page.module.scss';
import cx from 'classnames';

export const LoginPage: React.FunctionComponent = () => {
  const [login, { error }] = useLoginMutation();
  const navigate = useNavigate();
  const location = useLocation();

  const onSignIn = async (credentials: Credentials) => {
    const result = await login(credentials);
    if ((result as any).data) {
      navigate((location as any).state?.from?.pathname || '/register-contract', { replace: true });
    }
  };

  return (
    <div className={cx('h-full', 'w-full', 'm-0', 'py-7', 'px-4', styles.loginForm)}>
      <SignIn
        onSubmit={onSignIn}
        error={
          (error as FetchBaseQueryError)?.status === 401 ? 'Invalid Username of Password' : error && 'An error ocurred'
        }
      />
    </div>
  );
};
