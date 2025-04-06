import React, { useState, useEffect } from 'react';

export default function SharePostGenerator({ app, platform, content, onContentUpdate, isLoading, onRegenerate }) {
  const [postContent, setPostContent] = useState(content || '');
  
  // Update local state when content from parent changes
  useEffect(() => {
    if (content) {
      setPostContent(content);
    }
  }, [content]);
  
  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setPostContent(newContent);
    onContentUpdate(newContent);
  };
  
  const platformInfo = {
    linkedin: {
      label: 'LinkedIn',
      description: 'Create a professional message highlighting the business value of your app.',
    },
    twitter: {
      label: 'Twitter/X',
      description: 'Keep it concise and catchy. Use hashtags for better visibility.',
    },
    facebook: {
      label: 'Facebook',
      description: 'Make your post conversational and engaging for your friends and network.',
    },
    whatsapp: {
      label: 'WhatsApp',
      description: 'Create a direct and personal message for individual sharing.',
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium">Customize Your Message</h3>
        <button 
          onClick={onRegenerate}
          disabled={isLoading}
          className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center cursor-pointer"
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </span>
          ) : (
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Regenerate with AI
            </span>
          )}
        </button>
      </div>
      
      <p className="text-sm text-gray-600 mb-3">
        {platformInfo[platform]?.description || 'Customize your message for this platform.'}
      </p>
      
      {isLoading ? (
        <div className="w-full h-48 p-3 border rounded-md shadow-sm bg-gray-50 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-indigo-700 font-medium">Generating AI content...</span>
          </div>
        </div>
      ) : (
        <textarea
          value={postContent}
          onChange={handleContentChange}
          className="w-full h-48 p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 box-border"
          placeholder="Customize your message here..."
        />
      )}
      
      <div className="mt-2 text-sm text-gray-500">
        <p>Tips for Targeted Referrals:</p>
        <ul className="list-disc pl-5 mt-1">
          <li>Clearly state the problem your app solves</li>
          <li>Identify who would benefit most from your app</li>
          <li>Include a direct call to action asking readers to think of specific people</li>
          <li>Make it personal and authentic</li>
          <li>Mention any early success metrics to build credibility</li>
        </ul>
      </div>
    </div>
  );
}