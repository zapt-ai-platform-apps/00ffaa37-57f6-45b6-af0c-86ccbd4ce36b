import React from 'react';
import { IoBarChartSharp, IoBulbOutline, IoShareSocialOutline, IoRocketSharp } from 'react-icons/io5';

const features = [
  {
    name: 'AI-Powered Growth Strategies',
    description: "Get personalized, actionable strategies and recommendations to increase traction and grow your app's user base.",
    icon: IoBulbOutline,
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-50'
  },
  {
    name: 'Track Key Metrics',
    description: "Monitor user counts, revenue, and other critical KPIs to understand your app's performance at a glance.",
    icon: IoBarChartSharp,
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-50'
  },
  {
    name: 'Action Planning',
    description: 'Create and track action items systematically generated from proven growth strategies to achieve consistent traction.',
    icon: IoRocketSharp,
    color: 'from-purple-500 to-pink-600',
    bgColor: 'bg-purple-50'
  },
  {
    name: 'Public Sharing',
    description: 'Share your journey publicly to build in public, attract investors, or showcase your progress.',
    icon: IoShareSocialOutline,
    color: 'from-emerald-500 to-green-600',
    bgColor: 'bg-emerald-50'
  }
];

const FeatureSection = () => {
  return (
    <div className="py-24 bg-gray-50 rounded-3xl my-16">
      <div className="text-center mb-16">
        <span className="inline-block px-3 py-1 text-sm font-medium bg-indigo-100 text-indigo-800 rounded-full mb-4">
          Features
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Everything You Need to Grow Your App
        </h2>
        <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
          Get suggested growth actions, track metrics, and share your journey with the world
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {features.map((feature) => (
            <div 
              key={feature.name} 
              className="relative overflow-hidden bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:translate-y-[-4px]"
            >
              <div className={`absolute h-1.5 top-0 inset-x-0 bg-gradient-to-r ${feature.color}`}></div>
              <div className="p-8">
                <div className={`inline-flex items-center justify-center p-4 rounded-xl ${feature.bgColor} mb-6`}>
                  <feature.icon className={`h-7 w-7 text-gradient bg-gradient-to-br ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.name}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-16 text-center">
        <a 
          href="https://www.zapt.ai" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-flex items-center text-indigo-600 font-medium hover:text-indigo-700"
        >
          Learn about more ZAPT features
          <svg className="w-5 h-5 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default FeatureSection;