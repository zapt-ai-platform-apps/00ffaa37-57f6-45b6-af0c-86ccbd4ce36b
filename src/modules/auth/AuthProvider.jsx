import React, { createContext, useState, useEffect, useRef } from 'react';
import { supabase, recordLogin } from '@/supabaseClient';
import { eventBus } from '@/modules/core/events';
import { events } from './events';
import * as Sentry from '@sentry/browser';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext(null);

const AUTHORIZED_EMAILS = [
  'zapt.ai@gmail.com',
  // Add other authorized emails here
];

export default function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasRecordedLogin, setHasRecordedLogin] = useState(false);
  const [authError, setAuthError] = useState(null);
  const hasSessionRef = useRef(false);
  const navigate = useNavigate();
  
  // Use this function to update session so we also update our ref
  const updateSession = (newSession) => {
    setSession(newSession);
    hasSessionRef.current = newSession !== null;
  };

  // Function to check if user has permission
  const checkUserPermission = (user) => {
    if (!user || !user.email) return false;
    return AUTHORIZED_EMAILS.includes(user.email);
  };
  
  // Handle unauthorized user
  const handleUnauthorizedUser = async (user) => {
    console.log('Unauthorized access attempt:', user.email);
    setAuthError('You do not have permission to access this application.');
    
    // Redirect to login page to show the error
    navigate('/login');
    
    // Sign out after a short delay to ensure error message is seen
    setTimeout(async () => {
      try {
        await supabase.auth.signOut();
      } catch (error) {
        console.error('Error signing out unauthorized user:', error);
        Sentry.captureException(error);
      }
    }, 500);
  };
  
  useEffect(() => {
    console.log('AuthProvider: Checking session');
    // Check active session on initial mount
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        // Set initial session
        if (data.session) {
          // Check if user has permission
          if (checkUserPermission(data.session.user)) {
            updateSession(data.session);
            hasSessionRef.current = true;
          } else {
            // Handle unauthorized user
            handleUnauthorizedUser(data.session.user);
          }
        }
        setLoading(false);
      } catch (error) {
        console.error('Error checking session:', error);
        Sentry.captureException(error);
        setLoading(false);
      }
    };
    
    checkSession();
    
    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log('Auth event:', event, 'Has session:', hasSessionRef.current);
      
      // For SIGNED_IN, handle authorization
      if (event === 'SIGNED_IN') {
        if (!hasSessionRef.current) {
          const user = newSession?.user;
          
          // Check if user has permission
          if (user && checkUserPermission(user)) {
            updateSession(newSession);
            if (user.email) {
              eventBus.publish(events.USER_SIGNED_IN, { user });
              setHasRecordedLogin(false);
            }
          } else if (user) {
            // Handle unauthorized user
            handleUnauthorizedUser(user);
          }
        } else {
          console.log('Already have session, ignoring SIGNED_IN event');
        }
      }
      // For TOKEN_REFRESHED, always update the session
      else if (event === 'TOKEN_REFRESHED') {
        updateSession(newSession);
      }
      // For SIGNED_OUT, clear the session
      else if (event === 'SIGNED_OUT') {
        updateSession(null);
        eventBus.publish(events.USER_SIGNED_OUT, {});
        setHasRecordedLogin(false);
        setAuthError(null); // Clear any auth errors on signout
      }
    });
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [navigate]); 
  
  useEffect(() => {
    if (session?.user?.email && !hasRecordedLogin) {
      console.log('Recording login for:', session.user.email);
      recordLogin(session.user.email, import.meta.env.VITE_PUBLIC_APP_ENV);
      setHasRecordedLogin(true);
    }
  }, [session, hasRecordedLogin]);
  
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
      Sentry.captureException(error);
      throw error;
    }
  };
  
  return (
    <AuthContext.Provider value={{ 
      session, 
      user: session?.user || null, 
      loading, 
      signOut,
      authError 
    }}>
      {children}
    </AuthContext.Provider>
  );
}