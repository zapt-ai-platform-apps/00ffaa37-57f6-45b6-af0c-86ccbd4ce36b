import React from 'react';

export default function ZaptBadge() {
  return (
    <div className="fixed bottom-4 left-4 z-50">
      <a 
        href="https://www.zapt.ai" 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center bg-indigo-600 text-white px-3 py-2 rounded-md shadow-md hover:bg-indigo-700 transition-colors"
      >
        <span className="text-sm font-medium">Made on ZAPT</span>
      </a>
    </div>
  );
}