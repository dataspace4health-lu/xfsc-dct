import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './oidc.context';

const OidcProtectedRoute: React.FC = () => {
  const { user, login } = useAuth();
  if(!user)
    login();

  return <Outlet />
};


export default OidcProtectedRoute;