import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const userInfo = localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo');

    if (!token || !userInfo) {
        // User not authenticated; redirect to login page
        return <Navigate to="/" />;
    }

    // User authenticated; render the requested route
    return children;
};

export default ProtectedRoute;
