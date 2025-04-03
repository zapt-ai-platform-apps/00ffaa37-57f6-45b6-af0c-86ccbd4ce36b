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
        
        // Only allow david@mapt.events to sign in
        if (data.session?.user?.email && data.session.user.email !== 'david@mapt.events') {
          console.log('Unauthorized user, signing out:', data.session.user.email);
          // First set error and clear session, then sign out
          setAuthError('Only david@mapt.events is allowed to access this app.');
          updateSession(null);
          await supabase.auth.signOut();
          setLoading(false);
          return;
        }
        
        // Set initial session
        updateSession(data.session);
        if (data.session) {
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
      
      // For SIGNED_IN, only update session if we don't have one and it's the allowed user
      if (event === 'SIGNED_IN') {
        if (!hasSessionRef.current) {
          if (newSession?.user?.email === 'david@mapt.events') {
            updateSession(newSession);
            if (newSession?.user?.email) {
              eventBus.publish(events.USER_SIGNED_IN, { user: newSession.user });
              setHasRecordedLogin(false);
            }
          } else {
            console.log('Unauthorized user attempting to sign in:', newSession?.user?.email);
            // First set error and clear session, then sign out
            setAuthError('Only david@mapt.events is allowed to access this app.');
            updateSession(null);
            await supabase.auth.signOut();
          }
        } else {
          console.log('Already have session, ignoring SIGNED_IN event');
        }
      }
      // For TOKEN_REFRESHED, always update the session if it's the allowed user
      else if (event === 'TOKEN_REFRESHED') {
        if (newSession?.user?.email === 'david@mapt.events') {
          updateSession(newSession);
        } else if (newSession?.user) {
          console.log('Unauthorized user session refresh:', newSession.user.email);
          setAuthError('Only david@mapt.events is allowed to access this app.');
          updateSession(null);
          await supabase.auth.signOut();
        }
      }
      // For SIGNED_OUT, clear the session
      else if (event === 'SIGNED_OUT') {
        updateSession(null);
        eventBus.publish(events.USER_SIGNED_OUT, {});
        setHasRecordedLogin(false);
      }
    });
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []); 
  
  useEffect(() => {
    if (session?.user?.email && session.user.email === 'david@mapt.events' && !hasRecordedLogin) {
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