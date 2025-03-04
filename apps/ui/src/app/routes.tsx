import { Navigate, Outlet, Route, Router, Routes } from 'react-router-dom';
import React, { useEffect, useState, useMemo } from 'react';
import { LoginPage } from './pages/login';
import { EmptyLayout } from './layout/empty';
import { BaseLayout } from './layout/base';
import NotFoundPage from './pages/not-found';
import { useLocation } from './hooks/use-location';
import RegisterPage from './pages/register';
import { OidcProvider } from './oidc/oidc.context';
import OidcProtectedRoute from './oidc/oidc.protected.route';
import OidcCallback from './oidc/oidc.callback';

export const AppRoutes: React.FC = () => (
  <OidcProvider>
    <Routes>
      <Route element={<EmptyLayout />}>
         <Route path="*" element={<NotFoundPage />} />
         <Route path="/callback" element={<OidcCallback />} />
      </Route>
      <Route element={<OidcProtectedRoute />}>
        <Route path="/" element={<Navigate to="/register-contract" replace />} />
        <Route path="/register-contract" element={<RegisterPage />} />
      </Route>
    </Routes>
  </OidcProvider>
);