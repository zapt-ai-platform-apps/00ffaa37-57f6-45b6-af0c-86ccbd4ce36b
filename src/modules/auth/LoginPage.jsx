import React, { useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/supabaseClient';
import useAuth from './hooks/useAuth';

export default function LoginPage() {
  const { authError } = useAuth();
  
  useEffect(() => {
    // Log the auth error status to help with debugging
    if (authError) {
      console.log('Auth error displayed:', authError);
    }
  }, [authError]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <img 
            src="https://supabase.zapt.ai/storage/v1/render/image/public/icons/c7bd5333-787f-461f-ae9b-22acbc0ed4b0/55145115-0624-472f-96b9-d5d88aae355f.png?width=128&height=128" 
            alt="ZAPT Logo" 
            className="mx-auto h-16 w-auto"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            ZAPT Traction Tracker App
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in with ZAPT
          </p>
          <p className="text-center mt-2">
            <a href="https://www.zapt.ai" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-500">
              Visit zapt.ai
            </a>
          </p>
        </div>
        
        {authError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{authError}</span>
          </div>
        )}
        
        <div className="mt-8 card">
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            providers={['google', 'facebook', 'apple']}
            magicLink={true}
            view="magic_link"
          />
        </div>
      </div>
    </div>
  );
}