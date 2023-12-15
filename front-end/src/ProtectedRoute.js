/*CSCI2720 Project Group 15
MUI Chung Yin (1155163035)
WONG Chun Fei (1155144394)
NIU Ka Ngai (1155174712)
LI Chi (1155172017)
AU YEUNG Ho Hin (1155189480)*/

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
