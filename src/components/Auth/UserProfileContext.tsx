import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../amplify/data/resource";

const client = generateClient<Schema>();


interface UserProfileContextType {
    profile: any | null;
    loading: boolean;
    error: Error | null;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export const useUserProfile = () => {
    const context = useContext(UserProfileContext);
    if (!context) {
        throw new Error('useUserProfile must be used within a UserProfileProvider');
    }
    return context;
};

export const UserProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [profile, setProfile] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const { user } = useAuthenticator((context) => [context.user]);

    useEffect(() => {

        const fetchProfile = async () => {
            try {
                // Use observeQuery to fetch and subscribe to profile changes
                client.models.UserProfile.observeQuery({
                    filter: { id: { eq: user?.userId } },
                }).subscribe({
                    next: ({ items }) => {
                        // Assuming the query returns an array, take the first item
                        setProfile(items[0] || null);
                    },
                    error: (err) => {
                        console.error('Subscription error:', err);
                        setError(err as Error);
                    },
                });
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        };
        user?.userId && fetchProfile();
    }, [user?.userId]);

    return (
        <UserProfileContext.Provider value={{ profile, loading, error }}>
            {children}
        </UserProfileContext.Provider>
    );
};
