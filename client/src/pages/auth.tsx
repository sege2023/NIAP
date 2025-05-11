// import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { fetchAPI } from '../utils/api';

// const AuthCheck = () => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const verifyToken = async () => {
//       try {
//         const res = await fetchAPI('/api/v1/validate', { credentials: 'include' });

//         if (res.ok) {
//           navigate('/home');
//         } else {
//           navigate('/landing');
//         }
//       } catch (error) {
//         navigate('/landing');
//       }
//     };

//     verifyToken();
//   }, [navigate]);

//   return (
//     <div>
//       {/* Optional: you can show a small loading spinner here */}
//       Checking authentication...
//       <h1>hmm</h1>
//     </div>
//   );
// };

// export default AuthCheck;

import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { fetchAPI } from '../utils/api'; // Your fetchAPI wrapper

const ProtectedRoute: React.FC<{ redirectPath?: string }> = ({ redirectPath = '/landing' }) => {
    // State to track if the authentication check is still in progress
    const [isLoading, setIsLoading] = useState(true);
    // State to track the authentication status
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Define the async function to verify the token
        const verifyToken = async () => {
            try {
                // Call your validate API using the fetchAPI wrapper
                // fetchAPI is expected to throw an error for non-ok responses (like 401)
                const result = await fetchAPI('/api/v1/validate', { credentials: 'include' });

                // If fetchAPI did not throw, it means the response was ok (e.g., 200)
                // and it returned the parsed JSON. Check the 'ok' property from the backend.
                if (result && result.ok) {
                    setIsAuthenticated(true); // Set authenticated status to true
                } else {
                    // Even if the response was technically 'ok' but the backend sent { ok: false }
                    setIsAuthenticated(false); // Set authenticated status to false
                }
            } catch (error) {
                // If fetchAPI threw an error (e.g., 401 Unauthorized, network error)
                console.error("Authentication check failed:", error);
                setIsAuthenticated(false); // Authentication failed
            } finally {
                // This block runs regardless of success or failure
                setIsLoading(false); // Set loading to false once the check is complete
            }
        };

        // Execute the verification function when the component mounts
        verifyToken();

        // The dependency array is empty because we only want this effect to run once on mount
    }, []);

    // --- Rendering Logic ---

    // If still loading, show a loading indicator
    if (isLoading) {
        return <div>Checking authentication...</div>; // Or a spinner component
    }

    // If not authenticated after the check, redirect to the specified path
    if (!isAuthenticated) {
        // Use Navigate component for declarative redirection
        return <Navigate to={redirectPath} replace />;
    }

    // If authenticated, render the nested routes/components using Outlet
    // Outlet is part of React Router v6 and renders the matched child route
    return <Outlet />;
};

export default ProtectedRoute;
