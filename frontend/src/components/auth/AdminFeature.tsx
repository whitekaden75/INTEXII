import React, { useContext } from 'react';
import { UserContext } from './AuthorizeView';

function AdminFeature({ children }: { children: React.ReactNode }) {
    const user = useContext(UserContext);

    // Ensure user and roles exist, and check if Admin is one of the roles
    if (user && user.roles && user.roles.includes('Admin')) {
        return <>{children}</>;
    }

    return null;
}

export default AdminFeature;