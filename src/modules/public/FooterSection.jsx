import React from 'react';
import { Link } from 'react-router-dom';

const FooterSection = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <img 
                src="https://supabase.zapt.ai/storage/v1/render/image/public/icons/c7bd5333-787f-461f-ae9b-22acbc0ed4b0/55145115-0624-472f-96b9-d5d88aae355f.png?width=64&height=64" 
                alt="ZAPT Logo" 
                className="h-10 w-auto mr-3"
              />
              <h3 className="text-xl font-bold">ZAPT Traction Tracker</h3>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Monitor your app's growth, track key metrics, and share your journey with the world. 
              Built with ZAPT to help app creators succeed.
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com/zaptai" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="https://www.linkedin.com/company/zapt-ai/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white">Home</Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-400 hover:text-white">Sign In</Link>
              </li>
              <li>
                <a href="https://www.zapt.ai/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">Privacy Policy</a>
              </li>
              <li>
                <a href="https://www.zapt.ai/terms" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">Terms of Service</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Get Started</h3>
            <p className="text-gray-400 mb-4">Ready to track your app's growth?</p>
            <Link 
              to="/login" 
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded cursor-pointer inline-block transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} ZAPT Traction Tracker. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm mt-4 md:mt-0">
            <a href="https://www.zapt.ai" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              Built with ZAPT
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;