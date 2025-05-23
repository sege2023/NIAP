import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAPI } from "../utils/api"; 
const AuthCheck: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuthAndRedirect = async () => {
            try {
                const result = await fetchAPI('/api/v1/validate', { credentials: 'include' });

                if (result && result.ok) {
                    // If authenticated, redirect to homepage
                    navigate('/home', { replace: true });
                } else {
                    // If not authenticated, redirect to landing page
                    navigate('/landing', { replace: true });
                }
            } catch (error) {
                console.error("Initial auth check failed:", error);
                // If validation fails (e.g., network error, server error),
                // treat as unauthenticated for safety and redirect to landing.
                navigate('/landing', { replace: true });
            }
        };

        checkAuthAndRedirect();
    }, [navigate]); // Dependency array includes navigate

    // You can render a loading state here if needed, but
    // since it's a quick redirect, often nothing is rendered.
    return <div>Checking authentication...</div>; // Optional loading indicator
};

export default AuthCheck;