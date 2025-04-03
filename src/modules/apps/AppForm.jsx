import React, { useState } from 'react';

export default function AppForm({ onSubmit, onCancel, isLoading, initialData = {}, isEditing = false }) {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    description: initialData.description || '',
    userCount: initialData.userCount || 0,
    revenue: initialData.revenue || 0,
    domain: initialData.domain || '',
    ...initialData
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    // Convert numeric inputs to numbers
    const parsedValue = type === 'number' ? 
      (value === '' ? '' : parseFloat(value)) : 
      value;
    
    setFormData({
      ...formData,
      [name]: parsedValue
    });
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'App name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (formData.userCount < 0) {
      newErrors.userCount = 'User count cannot be negative';
    }
    
    if (formData.revenue < 0) {
      newErrors.revenue = 'Revenue cannot be negative';
    }
    
    // Optional domain validation - if provided, must be a valid URL or domain
    if (formData.domain && !isValidDomain(formData.domain)) {
      newErrors.domain = 'Please enter a valid domain (e.g., example.com)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidDomain = (domain) => {
    // Simple domain validation - can be enhanced as needed
    const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    return domainRegex.test(domain) || 
           // Also allow full URLs
           /^https?:\/\/([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(\/.*)?$/.test(domain);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          App Name*
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`input w-full box-border ${errors.name ? 'border-red-500' : ''}`}
          disabled={isLoading}
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
      </div>
      
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description*
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className={`input w-full box-border ${errors.description ? 'border-red-500' : ''}`}
          disabled={isLoading}
        ></textarea>
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
      </div>
      
      <div className="mb-4">
        <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-1">
          App Domain
        </label>
        <input
          type="text"
          id="domain"
          name="domain"
          value={formData.domain}
          onChange={handleChange}
          placeholder="example.com or https://example.com"
          className={`input w-full box-border ${errors.domain ? 'border-red-500' : ''}`}
          disabled={isLoading}
        />
        {errors.domain && <p className="mt-1 text-sm text-red-600">{errors.domain}</p>}
        <p className="mt-1 text-xs text-gray-500">
          Add your app domain to allow users to visit your app directly
        </p>
      </div>
      
      {!isEditing && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="userCount" className="block text-sm font-medium text-gray-700 mb-1">
              Current Users
            </label>
            <input
              type="number"
              id="userCount"
              name="userCount"
              value={formData.userCount}
              onChange={handleChange}
              min="0"
              className={`input w-full box-border ${errors.userCount ? 'border-red-500' : ''}`}
              disabled={isLoading}
            />
            {errors.userCount && <p className="mt-1 text-sm text-red-600">{errors.userCount}</p>}
          </div>
          
          <div>
            <label htmlFor="revenue" className="block text-sm font-medium text-gray-700 mb-1">
              Revenue ($)
            </label>
            <input
              type="number"
              id="revenue"
              name="revenue"
              value={formData.revenue}
              onChange={handleChange}
              min="0"
              step="0.01"
              className={`input w-full box-border ${errors.revenue ? 'border-red-500' : ''}`}
              disabled={isLoading}
            />
            {errors.revenue && <p className="mt-1 text-sm text-red-600">{errors.revenue}</p>}
          </div>
        </div>
      )}
      
      <div className="flex justify-end space-x-3 mt-6">
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
          className="btn-primary flex items-center cursor-pointer"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              Saving...
            </>
          ) : (
            'Save App'
          )}
        </button>
      </div>
    </form>
  );
}