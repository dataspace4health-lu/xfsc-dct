import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserManager } from 'oidc-client-ts';
import { oidcSettings } from './oidc.config';
import { useAuth } from './oidc.context';

const OidcCallback: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const userManager = new UserManager(oidcSettings);

  useEffect(() => {
    userManager.signinRedirectCallback().then(user => {
        navigate('/');
        
    }).catch(error => {
        console.error('Signin callback error:', error);
    });
  }, [login, navigate, userManager]);

  return <div>Loading...</div>;
};

export default OidcCallback;