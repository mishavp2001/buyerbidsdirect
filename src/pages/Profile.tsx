import React, { useEffect, useState } from 'react';
import UserProfileUpdateFormUI from '../ui-components/UserProfileUpdateForm'
import UserProfileCreateFormUI from '../ui-components/UserProfileCreateForm'
import { useAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";
import { fetchUserAttributes } from 'aws-amplify/auth';

const client = generateClient<Schema>();

const UserProfileUpdateForm: React.FC = () => {
   // Fetch user attributes when the component mounts
   useEffect(() => {
    const fetchAttributes = async () => {
    try {
        const userAttributes = await fetchUserAttributes();
        const email = userAttributes?.email ?? 'Guest';
        setEmail(email);
    } catch (err) {
        console.error('Error fetching user attributes:', err);
    }
    };

    fetchAttributes();
}, []);

  const { user } = useAuthenticator((context) => [context.user]);
  const userId = user?.userId;
  const [profileExists, setProfileExists] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const checkProfileExists = async () => {
      if (!userId) {
        setProfileExists(false); // No userId, assume profile doesn't exist
        return;
      }

      try {
        // Query to check if a profile exists
        const { data: profiles } = await client.models.UserProfile.list({
          filter: { id: { eq: userId } },
        });
        // Update state based on the result
        setProfileExists(profiles.length > 0);
      } catch (error) {
        console.error("Error checking profile existence:", error);
        setProfileExists(false); // Fallback to false on error
      }
    };

    checkProfileExists();
  }, [userId]);

  return (
    <div>
      {profileExists ? (
        <UserProfileUpdateFormUI id={userId} />
      ) : (
        <UserProfileCreateFormUI
          overrides={
            {
              id: { value: user?.userId, hidden: true, isDisabled: true },
              email: { value: email || user?.signInDetails?.loginId, hidden: true, isDisabled: true }
            }}
        />
      )}
    </div>
  );
};

export default UserProfileUpdateForm;
