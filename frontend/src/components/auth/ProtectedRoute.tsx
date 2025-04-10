// ProtectedRoute.tsx
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { UserContext } from './AuthorizeView';

const ProtectedRoute = () => {
const user = useContext(UserContext);

// If the user is not logged in, redirect to /login.
if (!user) {
    return <Navigate to="/login" />;
}

return <Outlet />;
};

export default ProtectedRoute;
