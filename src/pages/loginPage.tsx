import React, { useEffect } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { useAuthenticator, View } from '@aws-amplify/ui-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface LocationState {
  from: {
    pathname: string;
  };
}

export const LoginPage: React.FC = () => {
  const { route } = useAuthenticator((context) => [context.route]);
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as LocationState;
  const from = state?.from?.pathname || '/';

  useEffect(() => {
    if (route === 'authenticated') {
      navigate(from, { replace: true });
    }
  }, [route, navigate, from]);

  return (
    // TODO: socialProviders={['facebook', 'google']} to pass into Authenticator when integrated
    <View className="auth-wrapper context-container">
      <Authenticator loginMechanisms={['email']} socialProviders={['facebook']} />
    </View>
  );
};

export default LoginPage;