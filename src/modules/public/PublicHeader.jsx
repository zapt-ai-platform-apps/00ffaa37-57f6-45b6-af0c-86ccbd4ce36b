import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function PublicHeader() {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);
  
  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center">
          <img 
            src="https://supabase.zapt.ai/storage/v1/render/image/public/icons/c7bd5333-787f-461f-ae9b-22acbc0ed4b0/55145115-0624-472f-96b9-d5d88aae355f.png?width=64&height=64" 
            alt="ZAPT Logo" 
            className="h-10 w-auto mr-3"
          />
          <h1 className={`font-bold transition-colors duration-300 ${
            scrolled ? 'text-gray-900' : 'text-gray-900'
          } text-xl`}>ZAPT Traction Tracker</h1>
        </div>
        
        <div className="flex items-center space-x-5">
          <a 
            href="https://www.zapt.ai" 
            target="_blank" 
            rel="noopener noreferrer"
            className={`hidden sm:block transition-colors duration-300 ${
              scrolled ? 'text-indigo-600' : 'text-indigo-600'
            } hover:text-indigo-700 text-sm font-medium`}
          >
            Built with ZAPT
          </a>
          <Link 
            to="/login" 
            className={`btn-primary cursor-pointer transform transition-all hover:shadow-md active:shadow-sm active:translate-y-0.5 ${
              scrolled ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600 border border-indigo-200'
            }`}
          >
            Login
          </Link>
        </div>
      </div>
    </header>
  );
}