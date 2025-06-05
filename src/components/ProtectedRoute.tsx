import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  requireAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles,
  requireAuth = true 
}) => {
  const { isAuthenticated, user, isLoading, getRoleBasedRoute } = useAuth();

  // Temporary bypass for development - remove in production
  const isDevelopment = import.meta.env.DEV;
  const bypassAuth = isDevelopment && window.location.search.includes('bypass=true');
  
  if (bypassAuth) {
    console.log('🔓 Auth bypassed for development');
    return <>{children}</>;
  }

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  // Redirect to auth page if not authenticated and auth is required
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // If no role restrictions, allow access
  if (!allowedRoles || allowedRoles.length === 0) {
    return <>{children}</>;
  }

  // Check if user has required role
  const userRole = user?.role?.toLowerCase();
  const hasRequiredRole = allowedRoles.some(role => role.toLowerCase() === userRole);

  if (!hasRequiredRole) {
    // Redirect to appropriate dashboard based on user's role
    const targetRoute = getRoleBasedRoute();
    console.log(`🚫 Access denied. User role: ${userRole}, Required: ${allowedRoles.join(', ')}. Redirecting to: ${targetRoute}`);
    return <Navigate to={targetRoute} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
