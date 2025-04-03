import React, { useState } from 'react';

// Sample strategies for demonstration - in a real app, this would come from an LLM API
const sampleStrategies = [
  "Focus on content marketing by publishing weekly tutorials related to your app's functionality",
  "Create a referral program offering discounts to users who bring in new customers",
  "Launch a targeted social media campaign on platforms where your ideal users spend time",
  "Partner with complementary apps or services to cross-promote to each other's audiences",
  "Start a 30-day challenge related to your app's purpose to build community and engagement",
  "Create and distribute free valuable resources that showcase your app's capabilities",
  "Optimize your app store listing with better keywords, screenshots and descriptions",
  "Run limited-time promotions or special offers to create urgency",
  "Identify and reach out to influencers in your niche for reviews or partnerships",
  "Implement customer feedback loops to improve features users actually want"
];

export default function StrategyGenerator({ app, onSetStrategy, onCancel, isLoading }) {
  const [generatedStrategy, setGeneratedStrategy] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const generateStrategy = async () => {
    try {
      setIsThinking(true);
      
      // In a real app, this would be an API call to an LLM service
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Select a random strategy for demonstration
      const randomIndex = Math.floor(Math.random() * sampleStrategies.length);
      const strategy = sampleStrategies[randomIndex];
      
      setGeneratedStrategy(strategy);
    } catch (error) {
      console.error('Error generating strategy:', error);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div>
      {!generatedStrategy && !isThinking ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-6">
            Generate a focused traction strategy for your app using our AI assistant.
          </p>
          <button
            onClick={generateStrategy}
            className="btn-primary"
            disabled={isLoading}
          >
            Generate Strategy
          </button>
        </div>
      ) : isThinking ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Generating your strategy...</p>
        </div>
      ) : (
        <div className="py-4">
          <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-md mb-6">
            <p className="text-gray-800">{generatedStrategy}</p>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={onCancel}
              className="btn-secondary"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={() => onSetStrategy(generatedStrategy)}
              className="btn-primary flex items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  Saving...
                </>
              ) : (
                'Use This Strategy'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}