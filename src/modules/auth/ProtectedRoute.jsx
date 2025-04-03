import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '@/modules/auth/hooks/useAuth';
import LoadingPage from '@/shared/components/LoadingPage';

export default function ProtectedRoute({ element }) {
  const { user, loading, authError } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingPage />;
  }
  
  // If there's an auth error or no user, redirect to landing page instead of login
  if (authError || !user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return element;
}