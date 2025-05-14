import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { fetchAPI } from '../utils/api'; // Your fetchAPI wrapper

const ProtectedRoute: React.FC<{ redirectPath?: string }> = ({ redirectPath = '/landing' }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const result = await fetchAPI('/api/v1/validate', { credentials: 'include' })
                if (result && result.ok) {
                    setIsAuthenticated(true); // Set authenticated status to true
                } else {
                    setIsAuthenticated(false); // Set authenticated status to false
                }
            } catch (error) {
                console.error("Authentication check failed:", error);
                setIsAuthenticated(false); 
            } finally {
                setIsLoading(false); 
            }
        };
        verifyToken();
    }, []);

    if (isLoading) {
        return <div>Checking authentication...</div>; // Or a spinner component
    }

    if (!isAuthenticated) {
        return <Navigate to={redirectPath} replace />;
    }
    return <Outlet />;
};

export default ProtectedRoute;
