import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserManager, User } from 'oidc-client-ts';
import { oidcSettings } from './oidc.config';
import { useDispatch } from 'react-redux';
import { setAuthToken } from '../redux/slices/auth.slice';

interface OidcContextType {
  user: User | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const OidcContext = createContext<OidcContextType | undefined>(undefined);

export const OidcProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const userManager = new UserManager(oidcSettings);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) 
      userManager.getUser()
        .then(user => {
          dispatch(setAuthToken({accessToken: user?.access_token || '', expiresAt: user?.expires_at || 0}));
          return user;
        })
        .then(setUser);
  }, [user]);

  const login = () => userManager.signinRedirect();
  const logout = () => userManager.signoutRedirect();

  return (
    <OidcContext.Provider value={{ user, login, logout }}>
      {children}
    </OidcContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(OidcContext);
  if (!context) {
    throw new Error('useAuth must be used within an OidcProvider');
  }
  return context;
};