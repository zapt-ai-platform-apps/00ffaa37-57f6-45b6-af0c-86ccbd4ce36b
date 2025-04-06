import React, { useState, useEffect } from 'react';
import SharePostGenerator from './SharePostGenerator';
import PlatformPreview from './PlatformPreview';
import ShareButton from './ShareButton';

export default function ShareModal({ app, onClose }) {
  const [selectedPlatform, setSelectedPlatform] = useState('linkedin');
  const [shareContent, setShareContent] = useState({});
  const [isLoading, setIsLoading] = useState({
    linkedin: false,
    twitter: false,
    facebook: false,
    whatsapp: false
  });
  const [error, setError] = useState(null);
  
  // Generate initial content when app data changes or platform is selected
  useEffect(() => {
    if (app) {
      generateContentForPlatform(selectedPlatform);
    }
  }, [app, selectedPlatform]);
  
  const generateContentForPlatform = async (platform) => {
    setIsLoading(prev => ({ ...prev, [platform]: true }));
    setError(null);
    
    try {
      const response = await fetch('/api/generate-social-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`
        },
        body: JSON.stringify({ app, platform })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate content');
      }
      
      const data = await response.json();
      
      setShareContent(prev => ({
        ...prev,
        [platform]: data.content
      }));
    } catch (err) {
      console.error('Error generating content:', err);
      // Fallback to template-based content
      setShareContent(prev => ({
        ...prev,
        [platform]: generateFallbackContent(platform, app)
      }));
      setError('Could not generate AI content. Using template instead.');
    } finally {
      setIsLoading(prev => ({ ...prev, [platform]: false }));
    }
  };
  
  const handlePlatformChange = (platform) => {
    setSelectedPlatform(platform);
    // If we don't have content for this platform yet, generate it
    if (!shareContent[platform]) {
      generateContentForPlatform(platform);
    }
  };
  
  const handleContentUpdate = (platform, content) => {
    setShareContent(prev => ({
      ...prev,
      [platform]: content
    }));
  };
  
  const handleRegenerateContent = () => {
    generateContentForPlatform(selectedPlatform);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Share Your App</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Choose a Platform</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handlePlatformChange('linkedin')}
                className={`px-4 py-2 rounded-md cursor-pointer ${selectedPlatform === 'linkedin' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
                disabled={isLoading[selectedPlatform]}
              >
                LinkedIn
              </button>
              <button
                onClick={() => handlePlatformChange('twitter')}
                className={`px-4 py-2 rounded-md cursor-pointer ${selectedPlatform === 'twitter' ? 'bg-blue-400 text-white' : 'bg-gray-100'}`}
                disabled={isLoading[selectedPlatform]}
              >
                Twitter/X
              </button>
              <button
                onClick={() => handlePlatformChange('facebook')}
                className={`px-4 py-2 rounded-md cursor-pointer ${selectedPlatform === 'facebook' ? 'bg-blue-800 text-white' : 'bg-gray-100'}`}
                disabled={isLoading[selectedPlatform]}
              >
                Facebook
              </button>
              <button
                onClick={() => handlePlatformChange('whatsapp')}
                className={`px-4 py-2 rounded-md cursor-pointer ${selectedPlatform === 'whatsapp' ? 'bg-green-500 text-white' : 'bg-gray-100'}`}
                disabled={isLoading[selectedPlatform]}
              >
                WhatsApp
              </button>
            </div>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800 text-sm">
              {error}
            </div>
          )}
          
          <SharePostGenerator 
            app={app} 
            platform={selectedPlatform} 
            content={shareContent[selectedPlatform]} 
            onContentUpdate={(content) => handleContentUpdate(selectedPlatform, content)}
            isLoading={isLoading[selectedPlatform]}
            onRegenerate={handleRegenerateContent}
          />
          
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">Preview</h3>
            <PlatformPreview 
              platform={selectedPlatform} 
              content={shareContent[selectedPlatform]}
              isLoading={isLoading[selectedPlatform]}
            />
          </div>
          
          <div className="mt-6 flex justify-end">
            <ShareButton 
              platform={selectedPlatform} 
              content={shareContent[selectedPlatform]} 
              app={app} 
              disabled={isLoading[selectedPlatform] || !shareContent[selectedPlatform]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Fallback content generation if AI fails
function generateFallbackContent(platform, app) {
  switch (platform) {
    case 'linkedin':
      return generateLinkedinContent(app);
    case 'twitter':
      return generateTwitterContent(app);
    case 'facebook':
      return generateFacebookContent(app);
    case 'whatsapp':
      return generateWhatsappContent(app);
    default:
      return '';
  }
}

// Helper functions to generate content as fallback
function generateLinkedinContent(app) {
  return `I wanted to share this app I created: ${app.name}

It helps ${getAudienceDescription(app)} solve ${getProblemDescription(app)} by ${getBenefitDescription(app)}.

Do you know anyone who struggles with ${getProblemDescription(app)}? This could be exactly what they need.

If someone specific comes to mind, please take a moment to send them this link directly: ${app.domain || 'https://zapt.ai'}`;
}

function generateTwitterContent(app) {
  return `Just launched: ${app.name} 🚀

A solution for ${getProblemDescription(app)} that helps ${getAudienceDescription(app)} to ${getBenefitDescription(app)}.

Know someone who needs this? Tag them!

${app.domain || 'https://zapt.ai'} #ProductHunt #SaaS #Startup`;
}

function generateFacebookContent(app) {
  return `Hey friends! I wanted to share my app ${app.name} with you.

It's designed to help ${getAudienceDescription(app)} who struggle with ${getProblemDescription(app)}. It's already helped ${app.userCount || 'many'} people!

If you know anyone who might benefit from this, please share the link with them: ${app.domain || 'https://zapt.ai'}

Thanks for your support! 🙏`;
}

function generateWhatsappContent(app) {
  return `Hey! I just wanted to share my app ${app.name} with you. It helps with ${getProblemDescription(app)} and I thought it might be useful for you or someone you know. Check it out here: ${app.domain || 'https://zapt.ai'}`;
}

function getAudienceDescription(app) {
  // Extract audience from app description or provide a fallback
  const description = app.description || '';
  
  if (description.toLowerCase().includes('teams')) return 'teams';
  if (description.toLowerCase().includes('business')) return 'businesses';
  if (description.toLowerCase().includes('developer')) return 'developers';
  if (description.toLowerCase().includes('creator')) return 'content creators';
  if (description.toLowerCase().includes('marketer')) return 'marketers';
  if (description.toLowerCase().includes('designer')) return 'designers';
  if (description.toLowerCase().includes('freelancer')) return 'freelancers';
  
  return 'users';
}

function getProblemDescription(app) {
  // Extract problem from app description or provide a fallback
  const description = app.description || '';
  
  if (description.toLowerCase().includes('task')) return 'task management';
  if (description.toLowerCase().includes('time')) return 'time management';
  if (description.toLowerCase().includes('productivity')) return 'productivity challenges';
  if (description.toLowerCase().includes('workflow')) return 'workflow optimization';
  if (description.toLowerCase().includes('track')) return 'tracking progress';
  if (description.toLowerCase().includes('growth')) return 'growth tracking';
  if (description.toLowerCase().includes('metrics')) return 'metrics monitoring';
  
  return 'common challenges';
}

function getBenefitDescription(app) {
  // Extract benefit from app description or provide a fallback
  const description = app.description || '';
  
  if (description.toLowerCase().includes('save time')) return 'saving time';
  if (description.toLowerCase().includes('increase')) return 'increasing efficiency';
  if (description.toLowerCase().includes('track')) return 'tracking progress effectively';
  if (description.toLowerCase().includes('growth')) return 'accelerating growth';
  if (description.toLowerCase().includes('metrics')) return 'providing clear insights';
  if (description.toLowerCase().includes('analytics')) return 'offering detailed analytics';
  if (description.toLowerCase().includes('streamline')) return 'streamlining processes';
  
  return 'providing an intuitive solution';
}