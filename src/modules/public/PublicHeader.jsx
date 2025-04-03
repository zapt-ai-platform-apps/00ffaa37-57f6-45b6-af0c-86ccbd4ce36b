import React from 'react';

export default function PublicHeader() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <img 
            src="https://supabase.zapt.ai/storage/v1/render/image/public/icons/c7bd5333-787f-461f-ae9b-22acbc0ed4b0/55145115-0624-472f-96b9-d5d88aae355f.png?width=64&height=64" 
            alt="ZAPT Logo" 
            className="h-10 w-auto mr-3"
          />
          <h1 className="text-xl font-bold text-gray-900">ZAPT Traction Tracker</h1>
        </div>
        
        <div>
          <a 
            href="https://www.zapt.ai" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-700 text-sm"
          >
            Built with ZAPT
          </a>
        </div>
      </div>
    </header>
  );
}