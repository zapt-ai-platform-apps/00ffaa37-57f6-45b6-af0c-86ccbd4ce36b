import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '@/modules/auth/hooks/useAuth';
import LoadingPage from '@/shared/components/LoadingPage';

export default function PublicRoute({ element, restricted = false }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <LoadingPage />;
  }
  
  // If route is restricted and user is logged in, redirect to dashboard
  if (restricted && user) {
    const destinationPath = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={destinationPath} replace />;
  }
  
  return element;
}