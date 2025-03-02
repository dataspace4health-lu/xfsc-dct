import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserManager, User } from 'oidc-client-ts';
import { oidcSettings } from './oidc.config';

interface OidcContextType {
  user: User | null;
  login: () => void;
  logout: () => void;
}

const OidcContext = createContext<OidcContextType | undefined>(undefined);

export const OidcProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const userManager = new UserManager(oidcSettings);

  useEffect(() => {
    userManager.getUser().then(setUser);
  }, []);

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