import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface RoleBasedRedirectProps {
  children?: React.ReactNode;
}

const RoleBasedRedirect: React.FC<RoleBasedRedirectProps> = ({ children }) => {
  const { user, isAuthenticated, isLoading, getRoleBasedRoute } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      const targetRoute = getRoleBasedRoute();
      console.log(`🔀 Redirecting user with role '${user.role}' to: ${targetRoute}`);
      navigate(targetRoute, { replace: true });
    }
  }, [isAuthenticated, isLoading, user, navigate, getRoleBasedRoute]);

  // Show loading while determining redirect
  if (isLoading || (isAuthenticated && user)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default RoleBasedRedirect;
