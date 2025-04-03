import React, { useState } from 'react';

export default function AppForm({ app, onSubmit, onCancel, isLoading }) {
  const [name, setName] = useState(app?.name || '');
  const [description, setDescription] = useState(app?.description || '');
  const [userCount, setUserCount] = useState(app?.userCount || 0);
  const [revenue, setRevenue] = useState(app?.revenue || 0);
  const [domain, setDomain] = useState(app?.domain || '');
  const [isPublic, setIsPublic] = useState(app?.isPublic || false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        name,
        description,
        userCount: Number(userCount),
        revenue: Number(revenue),
        domain: domain.trim() || null,
        isPublic
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          App Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`input ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="My Awesome App"
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
      </div>
      
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`input ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
          rows="3"
          placeholder="A brief description of what your app does"
        ></textarea>
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="userCount" className="block text-sm font-medium text-gray-700 mb-1">
            User Count
          </label>
          <input
            type="number"
            id="userCount"
            value={userCount}
            onChange={(e) => setUserCount(e.target.value)}
            className="input border-gray-300"
            min="0"
          />
        </div>
        
        <div>
          <label htmlFor="revenue" className="block text-sm font-medium text-gray-700 mb-1">
            Revenue ($)
          </label>
          <input
            type="number"
            id="revenue"
            value={revenue}
            onChange={(e) => setRevenue(e.target.value)}
            className="input border-gray-300"
            min="0"
            step="0.01"
          />
        </div>
      </div>
      
      <div className="mb-4">
        <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-1">
          App URL / Domain (optional)
        </label>
        <input
          type="text"
          id="domain"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          className="input border-gray-300"
          placeholder="https://myapp.com"
        />
        <p className="mt-1 text-sm text-gray-500">
          Enter the full URL where your app is deployed
        </p>
      </div>
      
      <div className="mb-6">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isPublic"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
          />
          <label htmlFor="isPublic" className="ml-2 block text-sm font-medium text-gray-700">
            Make this app public
          </label>
        </div>
        <p className="mt-1 text-sm text-gray-500 ml-6">
          When enabled, this app will be visible on your public dashboard
        </p>
      </div>
      
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary cursor-pointer"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary cursor-pointer"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : (app ? 'Update App' : 'Create App')}
        </button>
      </div>
    </form>
  );
}