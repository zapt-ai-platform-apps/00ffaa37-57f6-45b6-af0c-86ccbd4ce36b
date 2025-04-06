import React, { useState, useEffect } from 'react';

export default function SharePostGenerator({ app, platform, content, onContentUpdate }) {
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
  
  return (
    <div>
      <h3 className="text-lg font-medium mb-3">Customize Your Message</h3>
      <p className="text-sm text-gray-600 mb-3">
        {platform === 'linkedin' && 'Create a professional message highlighting the business value of your app.'}
        {platform === 'twitter' && 'Keep it concise and catchy. Use hashtags for better visibility.'}
        {platform === 'facebook' && 'Make your post conversational and engaging for your friends and network.'}
        {platform === 'whatsapp' && 'Create a direct and personal message for individual sharing.'}
      </p>
      <textarea
        value={postContent}
        onChange={handleContentChange}
        className="w-full h-48 p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 box-border"
        placeholder="Customize your message here..."
      />
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