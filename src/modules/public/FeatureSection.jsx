import React from 'react';
import { IoBarChartSharp, IoBulbOutline, IoShareSocialOutline, IoRocketSharp } from 'react-icons/io5';

const features = [
  {
    name: 'Track Key Metrics',
    description: 'Monitor user counts, revenue, and other critical KPIs to understand your app's performance at a glance.',
    icon: IoBarChartSharp,
    color: 'from-blue-500 to-indigo-600'
  },
  {
    name: 'Strategic Guidance',
    description: 'Get actionable insights and strategic recommendations to help grow your app and increase traction.',
    icon: IoBulbOutline,
    color: 'from-amber-500 to-orange-600'
  },
  {
    name: 'Public Sharing',
    description: 'Share your journey publicly to build in public, attract investors, or showcase your progress.',
    icon: IoShareSocialOutline,
    color: 'from-emerald-500 to-green-600'
  },
  {
    name: 'Action Planning',
    description: 'Create and track action items to systematically grow your app and achieve milestones.',
    icon: IoRocketSharp,
    color: 'from-purple-500 to-pink-600'
  }
];

const FeatureSection = () => {
  return (
    <div className="py-16">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Everything You Need to Grow Your App
        </h2>
        <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
          Track metrics, plan your next steps, and share your journey with the world
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {features.map((feature) => (
          <div key={feature.name} className="relative overflow-hidden bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className={`absolute h-1.5 top-0 inset-x-0 bg-gradient-to-r ${feature.color}`}></div>
            <div className="p-6 sm:p-8">
              <div className={`inline-flex items-center justify-center p-3 rounded-lg bg-gradient-to-br ${feature.color} text-white shadow-lg mb-5`}>
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mt-2">{feature.name}</h3>
              <p className="mt-3 text-gray-600">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureSection;