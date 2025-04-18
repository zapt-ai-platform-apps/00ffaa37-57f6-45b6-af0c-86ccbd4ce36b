import React, { createContext, useState, useEffect, useRef } from 'react';
import { supabase, recordLogin } from '@/supabaseClient';
import { eventBus } from '@/modules/core/events';
import { events } from './events';
import * as Sentry from '@sentry/browser';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext(null);

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
  
  useEffect(() => {
    console.log('AuthProvider: Checking session');
    // Check active session on initial mount
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        // Set initial session
        if (data.session) {
          updateSession(data.session);
          hasSessionRef.current = true;
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
      
      // For SIGNED_IN, only update session if we don't have one
      if (event === 'SIGNED_IN') {
        if (!hasSessionRef.current) {
          updateSession(newSession);
          if (newSession?.user?.email) {
            eventBus.publish(events.USER_SIGNED_IN, { user: newSession.user });
            setHasRecordedLogin(false);
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
        setAuthError(null);
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
      authError
    }}>
      {children}
    </AuthContext.Provider>
  );
}