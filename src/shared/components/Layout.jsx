import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '@/modules/auth/hooks/useAuth';

export default function Layout({ children }) {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/dashboard" className="flex items-center">
            <img 
              src="https://supabase.zapt.ai/storage/v1/render/image/public/icons/c7bd5333-787f-461f-ae9b-22acbc0ed4b0/55145115-0624-472f-96b9-d5d88aae355f.png?width=64&height=64" 
              alt="ZAPT Logo" 
              className="h-10 w-auto mr-3"
            />
            <h1 className="text-xl font-bold text-gray-900">ZAPT Traction Tracker</h1>
          </Link>
          
          {user && (
            <div className="flex items-center space-x-4">
              <button 
                onClick={signOut} 
                className="text-gray-600 hover:text-gray-900 cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </header>
      
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
}