import React, { useState } from 'react';

export default function ShareButton({ platform, content, app }) {
  const [isSharing, setIsSharing] = useState(false);
  const [shareResult, setShareResult] = useState(null);
  
  const handleShare = async () => {
    setIsSharing(true);
    setShareResult(null);
    
    try {
      // Different sharing mechanisms based on platform
      switch (platform) {
        case 'linkedin':
          window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(app.domain || 'https://zapt.ai')}&summary=${encodeURIComponent(content)}`, '_blank');
          break;
          
        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(content)}`, '_blank');
          break;
          
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(app.domain || 'https://zapt.ai')}&quote=${encodeURIComponent(content)}`, '_blank');
          break;
          
        case 'whatsapp':
          window.open(`https://wa.me/?text=${encodeURIComponent(content)}`, '_blank');
          break;
          
        default:
          navigator.clipboard.writeText(content);
          setShareResult({
            success: true,
            message: 'Content copied to clipboard!'
          });
      }
      
      if (platform !== 'clipboard') {
        setShareResult({
          success: true,
          message: `Content shared to ${platform}!`
        });
      }
    } catch (error) {
      console.error('Error sharing content:', error);
      setShareResult({
        success: false,
        message: 'Failed to share content. Please try again.'
      });
    } finally {
      setIsSharing(false);
    }
  };
  
  const copyToClipboard = async () => {
    setIsSharing(true);
    try {
      await navigator.clipboard.writeText(content);
      setShareResult({
        success: true,
        message: 'Content copied to clipboard!'
      });
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      setShareResult({
        success: false,
        message: 'Failed to copy content. Please try again.'
      });
    } finally {
      setIsSharing(false);
    }
  };
  
  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <button
          onClick={handleShare}
          disabled={isSharing}
          className="btn-primary cursor-pointer flex items-center"
        >
          {isSharing ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              Sharing...
            </>
          ) : (
            <>
              Share to {platform === 'twitter' ? 'Twitter/X' : platform.charAt(0).toUpperCase() + platform.slice(1)}
            </>
          )}
        </button>
        
        <button
          onClick={copyToClipboard}
          disabled={isSharing}
          className="btn-secondary cursor-pointer flex items-center"
        >
          {isSharing ? (
            <>
              <span className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mr-2"></span>
              Copying...
            </>
          ) : (
            'Copy to Clipboard'
          )}
        </button>
      </div>
      
      {shareResult && (
        <div className={`text-sm ${shareResult.success ? 'text-green-600' : 'text-red-600'}`}>
          {shareResult.message}
        </div>
      )}
    </div>
  );
}