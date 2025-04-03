import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply opacity-20 animate-blob"></div>
        <div className="absolute top-96 -right-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10">
        <div className="md:flex md:items-center md:justify-between">
          <div className="md:w-1/2 mb-12 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
              <span className="block">Track Your App's</span>
              <span className="block text-indigo-600">Journey to Success</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-lg">
              Monitor growth, track metrics, and share your app's progress with the world. Built with ZAPT to empower app creators.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Link
                to="/login"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-all cursor-pointer transform hover:translate-y-[-2px]"
              >
                Get Started
              </Link>
              <a
                href="https://www.zapt.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 font-medium hover:text-indigo-700 flex items-center"
              >
                Learn more about ZAPT
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 ml-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
            </div>
          </div>
          
          <div className="md:w-1/2 flex justify-center">
            <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100 transform rotate-1 hover:rotate-0 transition-transform duration-300">
              <div className="p-1 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
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
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium text-gray-700">Active Users</h4>
                      <span className="text-sm text-green-600 font-medium">+18%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-200 rounded-full">
                      <div className="h-2 bg-green-500 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium text-gray-700">Revenue</h4>
                      <span className="text-sm text-purple-600 font-medium">+24%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-200 rounded-full">
                      <div className="h-2 bg-purple-500 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium text-gray-700">Action Items</h4>
                      <span className="text-sm text-amber-600 font-medium">8/10</span>
                    </div>
                    <div className="h-2 w-full bg-gray-200 rounded-full">
                      <div className="h-2 bg-amber-500 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;