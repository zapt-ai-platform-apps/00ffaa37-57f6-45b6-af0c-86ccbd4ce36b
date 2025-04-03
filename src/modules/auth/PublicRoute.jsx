import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '@/modules/auth/hooks/useAuth';
import LoadingPage from '@/shared/components/LoadingPage';

export default function PublicRoute({ element, restricted = false }) {
  const { user, loading, authError } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <LoadingPage />;
  }
  
  // If user is logged in, there's no auth error, and it's a restricted route, redirect to dashboard
  if (user && !authError && (location.pathname === '/' || restricted)) {
    const destinationPath = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={destinationPath} replace />;
  }
  
  return element;
}