// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({children }) => {
    const { isAuthenticated } = useAuth();

    console.log(isAuthenticated,"auth 9");
    

return isAuthenticated ? children : <div>hello</div>
    // return isAuthenticated ? <Component /> : <Navigate to="/login" />;
};

export default PrivateRoute;
