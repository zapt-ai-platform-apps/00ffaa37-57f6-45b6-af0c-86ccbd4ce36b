import React, { createContext, useState, useEffect, useRef } from 'react';
import { supabase, recordLogin } from '@/supabaseClient';
import { eventBus } from '@/modules/core/events';
import { events } from './events';
import * as Sentry from '@sentry/browser';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext(null);

// Authorized emails list - remove zapt.ai@gmail.com from here
const AUTHORIZED_EMAILS = [
  'david@mapt.events',
  // Add other authorized emails here
];

// Explicitly blocked emails
const BLOCKED_EMAILS = [
  'zapt.ai@gmail.com',
];

export default function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasRecordedLogin, setHasRecordedLogin] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [isSigningOut, setIsSigningOut] = useState(false);
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
    
    const email = user.email.toLowerCase();
    
    // First check if email is explicitly blocked
    if (BLOCKED_EMAILS.includes(email)) {
      return false;
    }
    
    // Then check if email is in the authorized list
    return AUTHORIZED_EMAILS.includes(email);
  };
  
  // Handle unauthorized user
  const handleUnauthorizedUser = async (user) => {
    console.log('Unauthorized access attempt:', user.email);
    
    // Set auth error message
    let errorMessage = 'You do not have permission to access this application.';
    if (BLOCKED_EMAILS.includes(user.email.toLowerCase())) {
      errorMessage = 'This email address has been blocked from accessing this application.';
    }
    
    setAuthError(errorMessage);
    setIsSigningOut(true);
    
    // Redirect to login page to show the error
    navigate('/login');
    
    // Sign out after a longer delay to ensure error message is seen
    setTimeout(async () => {
      try {
        await supabase.auth.signOut();
        // Don't clear the auth error immediately after sign out
        // We'll keep it visible on the login page
      } catch (error) {
        console.error('Error signing out unauthorized user:', error);
        Sentry.captureException(error);
      } finally {
        setIsSigningOut(false);
      }
    }, 10000); // Increased to 10 seconds to ensure users see the message
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
      // For SIGNED_OUT, clear the session but maintain the error if we're in the signing out process
      else if (event === 'SIGNED_OUT') {
        updateSession(null);
        eventBus.publish(events.USER_SIGNED_OUT, {});
        setHasRecordedLogin(false);
        
        // Only clear auth error if we're not in the process of signing out an unauthorized user
        if (!isSigningOut) {
          setAuthError(null);
        }
      }
    });
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [navigate, isSigningOut]); 
  
  useEffect(() => {
    if (session?.user?.email && !hasRecordedLogin) {
      console.log('Recording login for:', session.user.email);
      recordLogin(session.user.email, import.meta.env.VITE_PUBLIC_APP_ENV);
      setHasRecordedLogin(true);
    }
  }, [session, hasRecordedLogin]);
  
  const signOut = async () => {
    try {
      setAuthError(null); // Clear any auth errors when user explicitly signs out
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
      authError,
      isSigningOut
    }}>
      {children}
    </AuthContext.Provider>
  );
}