import React from 'react';

const testimonials = [
  {
    content: "The ZAPT Traction Tracker has completely transformed how I monitor my app's growth. The metrics are clear, and the action planning feature keeps me focused on what matters.",
    author: "Sarah Johnson",
    role: "Founder, FitTech App",
    avatar: "PLACEHOLDER",
    avatarAlt: "Sarah Johnson",
    "data-image-request": "professional woman with glasses smiling"
  },
  {
    content: "Building in public became so much easier with this tool. I can share my journey and keep track of what's working and what's not, all in one place.",
    author: "Michael Chen",
    role: "Creator, TaskMaster",
    avatar: "PLACEHOLDER",
    avatarAlt: "Michael Chen",
    "data-image-request": "asian man in casual business attire"
  },
  {
    content: "As an investor, I love when founders use this tool. It gives me clear insight into their traction and strategy, making investment decisions much easier.",
    author: "Lisa Rodriguez",
    role: "Angel Investor",
    avatar: "PLACEHOLDER",
    avatarAlt: "Lisa Rodriguez",
    "data-image-request": "professional latina woman in business suit"
  }
];

const TestimonialSection = () => {
  return (
    <div className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">What People Are Saying</h2>
        <p className="mt-4 text-xl text-gray-600">Join hundreds of app builders tracking their success</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="p-8">
              <svg className="h-8 w-8 text-indigo-400 mb-4" fill="currentColor" viewBox="0 0 32 32">
                <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
              </svg>
              <p className="text-gray-700 mb-6 leading-relaxed">{testimonial.content}</p>
              <div className="flex items-center">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.avatarAlt} 
                  data-image-request={testimonial["data-image-request"]}
                  className="h-12 w-12 rounded-full object-cover mr-4"
                />
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.author}</p>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialSection;