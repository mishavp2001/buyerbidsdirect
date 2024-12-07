import { useLocation, Navigate } from 'react-router-dom';
import React, { ReactNode } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';

interface RequireAuthProps {
    children: ReactNode;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
    const location = useLocation();
    //const { loading } = useUserProfile();

    const { route } = useAuthenticator((context) => [context.route]);

    if (route !== 'authenticated') {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}

export default RequireAuth;
