import React from 'react';
import UserProfileCreateFormUI from '../ui-components/UserProfileCreateForm'
import { useAuthenticator } from '@aws-amplify/ui-react';

const UserProfileUpdateForm: React.FC = () => {
  const { user } = useAuthenticator((context) => [context.user]);

  return (
    <UserProfileCreateFormUI 
    overrides={
      {
        id: {value: user?.userId, hidden: true, isDisabled: true}
      }
    }/>
  );
};

export default UserProfileUpdateForm;
