import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import React from 'react';
import { LoginPage } from './pages/login';
import { EmptyLayout } from './layout/empty';
import { BaseLayout } from './layout/base';
import NotFoundPage from './pages/not-found';
import { useLocation } from './hooks/use-location';
import RegisterPage from './pages/register';

export interface AppRoutesProps {
  isAuthenticated: boolean;
  onSignOut: () => void;
}

const AuthenticatedRoutes: React.FunctionComponent<{
  isAuthenticated: boolean;
}> = ({ isAuthenticated }) => {
  let location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
};

export const AppRoutes: React.FC<AppRoutesProps> = ({ isAuthenticated, onSignOut }) => {
  return (
    <Routes >
      <Route element={<EmptyLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      <Route element={<BaseLayout onSignOut={onSignOut} />}>
          <Route path="/register-contract" element={<RegisterPage />} />
        </Route>
        <Route index element={<Navigate to="/register-contract" replace />} />
      <Route element={<AuthenticatedRoutes isAuthenticated={isAuthenticated} />}>
      </Route>
    </Routes>
  );
};
