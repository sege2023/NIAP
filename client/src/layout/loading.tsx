// components/LoadingIndicator.tsx
// import React from 'r

interface LoadingIndicatorProps {
  isLoading: boolean;
  children?: React.ReactNode; 
  fallback?: React.ReactNode; 
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ isLoading, children, fallback }) => {
  if (isLoading) {
    // You can put a spinner, skeleton loader, or anything here
    return fallback || <div >Loading...</div>;
  }
  return <>{children}</>; // Render children when not loading
};

export default LoadingIndicator;