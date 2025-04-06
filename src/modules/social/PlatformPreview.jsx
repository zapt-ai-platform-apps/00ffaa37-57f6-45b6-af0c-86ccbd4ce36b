import React from 'react';

export default function PlatformPreview({ platform, content, isLoading }) {
  // Different styling for different platforms
  let previewStyle = "p-4 rounded-md border";
  let headerContent = null;
  
  switch (platform) {
    case 'linkedin':
      previewStyle += " bg-gray-100 border-blue-300";
      headerContent = <LinkedInHeader />;
      break;
    case 'twitter':
      previewStyle += " bg-blue-50 border-blue-200";
      headerContent = <TwitterHeader />;
      break;
    case 'facebook':
      previewStyle += " bg-blue-50 border-blue-400";
      headerContent = <FacebookHeader />;
      break;
    case 'whatsapp':
      previewStyle += " bg-green-50 border-green-300";
      headerContent = <WhatsAppHeader />;
      break;
    default:
      previewStyle += " bg-gray-100";
  }
  
  return (
    <div className={previewStyle}>
      {headerContent}
      {isLoading ? (
        <div className="mt-3 h-32 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-gray-600">Generating preview...</span>
          </div>
        </div>
      ) : (
        <div className="mt-3 whitespace-pre-wrap text-gray-800">{content}</div>
      )}
      <div className="mt-4 text-xs text-gray-500">
        Preview is approximate. Actual appearance may vary on different platforms.
      </div>
    </div>
  );
}

function LinkedInHeader() {
  return (
    <div className="flex items-center">
      <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-white">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 0a4 4 0 014 4v16a4 4 0 01-4 4H4a4 4 0 01-4-4V4a4 4 0 014-4h16zM8.95 9.4H6.16v8.1h2.8V9.4zm-1.4-4.6a1.6 1.6 0 100 3.2 1.6 1.6 0 000-3.2zm9.3 4.6h-2.68v.91c.7-.72 1.5-1.01 2.38-1.01 1.76 0 2.7 1.22 2.7 3.33V17.5h-2.8v-4.27c0-.84-.35-1.27-1.03-1.27-.51 0-.92.26-1.26.86V17.5h-2.8V9.4h2.8v.91z"></path>
        </svg>
      </div>
      <div className="ml-3">
        <p className="font-semibold">Your Name</p>
        <p className="text-xs text-gray-500">Just now • LinkedIn</p>
      </div>
    </div>
  );
}

function TwitterHeader() {
  return (
    <div className="flex items-center">
      <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-white">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      </div>
      <div className="ml-3">
        <p className="font-semibold">Your Name</p>
        <p className="text-xs text-gray-500">@yourusername • Just now</p>
      </div>
    </div>
  );
}

function FacebookHeader() {
  return (
    <div className="flex items-center">
      <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-white">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      </div>
      <div className="ml-3">
        <p className="font-semibold">Your Name</p>
        <p className="text-xs text-gray-500">Just now • Facebook</p>
      </div>
    </div>
  );
}

function WhatsAppHeader() {
  return (
    <div className="flex items-center">
      <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </div>
      <div className="ml-3">
        <p className="font-semibold">WhatsApp</p>
        <p className="text-xs text-gray-500">Direct Message</p>
      </div>
    </div>
  );
}