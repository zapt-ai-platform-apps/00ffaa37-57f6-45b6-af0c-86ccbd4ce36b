import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white">
      {/* Background Elements - Enhanced with more vibrant elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-400 rounded-full mix-blend-soft-light opacity-20 animate-blob"></div>
        <div className="absolute top-96 -right-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-soft-light opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-soft-light opacity-20 animate-blob animation-delay-4000"></div>
        
        {/* Additional floating elements for visual interest */}
        <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-blue-400 rounded-full mix-blend-soft-light opacity-10 animate-blob animation-delay-3000"></div>
        <div className="absolute bottom-1/3 right-1/3 w-40 h-40 bg-violet-400 rounded-full mix-blend-soft-light opacity-10 animate-blob animation-delay-5000"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMxLjIgMCAyLjMuNCAzLjIgMS4yLjguOCAxLjIgMS44IDEuMiAzdjE1LjZjMCAxLjItLjQgMi4yLTEuMiAzLS45LjgtMiAxLjItMy4yIDEuMkgyNGMtMS4yIDAtMi4zLS40LTMuMi0xLjItLjgtLjgtMS4yLTEuOC0xLjItM1YyMi4yYzAtMS4yLjQtMi4yIDEuMi0zIC45LS44IDItMS4yIDMuMi0xLjJoMTJ6TTYwIDBIMHY2MGg2MFYweiIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIuMDUiLz48L2c+PC9zdmc+')] opacity-10"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10">
        <div className="md:flex md:items-center md:justify-between">
          <div className="md:w-1/2 mb-12 md:mb-0">
            <span className="inline-block px-3 py-1 text-sm font-medium bg-indigo-500 bg-opacity-30 rounded-full mb-6 border border-indigo-400 border-opacity-30">
              Track • Measure • Grow
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
              <span className="block text-white">Track Your App's</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-pink-300">Journey to Success</span>
            </h1>
            <p className="mt-6 text-xl text-indigo-100 max-w-lg leading-relaxed">
              Monitor growth, track metrics, and share your app's progress with the world. Built with ZAPT to empower app creators.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center gap-y-4 gap-x-6">
              <Link
                to="/login"
                className="w-full sm:w-auto bg-white text-indigo-900 font-semibold py-3 px-8 rounded-lg shadow-lg transition-all cursor-pointer hover:bg-indigo-50 transform hover:translate-y-[-2px] flex items-center justify-center gap-2"
              >
                <span>Get Started</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <a
                href="https://www.zapt.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto border border-indigo-300 border-opacity-50 text-white font-medium py-3 px-8 rounded-lg hover:bg-indigo-800 hover:bg-opacity-30 flex items-center justify-center gap-2 transition-colors"
              >
                <span>Learn more about ZAPT</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </a>
            </div>
          </div>
          
          <div className="md:w-1/2 flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-indigo-500 rounded-lg blur-md opacity-25 group-hover:opacity-40 transition duration-500"></div>
              <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100 transform rotate-1 hover:rotate-0 transition-transform duration-300 relative">
                <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                <div className="p-6">
                  <div className="flex items-center mb-6">
                    <img 
                      src="https://supabase.zapt.ai/storage/v1/render/image/public/icons/c7bd5333-787f-461f-ae9b-22acbc0ed4b0/55145115-0624-472f-96b9-d5d88aae355f.png?width=64&height=64" 
                      alt="ZAPT Logo" 
                      className="h-10 w-auto mr-3"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">ZAPT Traction Tracker</h3>
                      <p className="text-sm text-gray-500">Dashboard Overview</p>
                    </div>
                  </div>
                  
                  <div className="space-y-5">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-medium text-gray-700">Active Users</h4>
                        <span className="text-sm text-green-600 font-medium flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
                            <path fillRule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z" clipRule="evenodd" />
                          </svg>
                          18%
                        </span>
                      </div>
                      <div className="h-2 w-full bg-gray-200 rounded-full">
                        <div className="h-2 bg-green-500 rounded-full" style={{ width: '78%' }}></div>
                      </div>
                      <div className="mt-1 text-xs text-gray-500">2,458 users this week</div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-medium text-gray-700">Revenue</h4>
                        <span className="text-sm text-purple-600 font-medium flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
                            <path fillRule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z" clipRule="evenodd" />
                          </svg>
                          24%
                        </span>
                      </div>
                      <div className="h-2 w-full bg-gray-200 rounded-full">
                        <div className="h-2 bg-purple-500 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                      <div className="mt-1 text-xs text-gray-500">$12,450 this month</div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-medium text-gray-700">Action Items</h4>
                        <span className="text-sm text-amber-600 font-medium">8/10</span>
                      </div>
                      <div className="h-2 w-full bg-gray-200 rounded-full">
                        <div className="h-2 bg-amber-500 rounded-full" style={{ width: '80%' }}></div>
                      </div>
                      <div className="mt-1 flex justify-between items-center text-xs text-gray-500">
                        <span>2 remaining</span>
                        <span className="text-indigo-600">View all</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Wave divider at bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full">
          <path 
            fill="#f9fafb" 
            fillOpacity="1" 
            d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default Hero;