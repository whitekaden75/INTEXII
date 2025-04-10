import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { UserContext } from './AuthorizeView';

const AdminRoute = () => {
const user = useContext(UserContext);

    if (!user) {
        // Not logged in
        return <Navigate to="/login" />;
    }

    if (!user.roles || !user.roles.includes('Administrator')) {
        // Logged in but not an admin—redirect to an unauthorized access page
        return <Navigate to="/unauthorized" />;
    }

    return <Outlet />;
};

export default AdminRoute;
