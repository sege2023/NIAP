import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { fetchAPI } from '../utils/api'; 

const ProtectedRoute: React.FC<{ redirectPath?: string }> = ({ redirectPath = '/landing' }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const result = await fetchAPI('/api/v1/validate', { credentials: 'include' })
                if (result && result.ok) {
                    setIsAuthenticated(true); 
                } else {
                    setIsAuthenticated(false); 
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
        return <div>Checking authentication...</div>; 
    }

    if (!isAuthenticated) {
        return <Navigate to={redirectPath} replace />;
    }
    return <Outlet />;
};

export default ProtectedRoute;
