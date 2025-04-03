import React, { useState } from 'react';

export default function MetricsForm({ app, onSubmit, onCancel, isLoading }) {
  // Safely handle app being undefined with defensive initialization
  const initialUserCount = app && typeof app.userCount !== 'undefined' ? app.userCount : 0;
  const initialRevenue = app && typeof app.revenue !== 'undefined' ? app.revenue : 0;

  const [formData, setFormData] = useState({
    userCount: initialUserCount,
    revenue: initialRevenue
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
    
    if (formData.userCount < 0) {
      newErrors.userCount = 'User count cannot be negative';
    }
    
    if (formData.revenue < 0) {
      newErrors.revenue = 'Revenue cannot be negative';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-4">Traction Metrics</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              className={`input w-full box-border ${errors.userCount ? 'border-red-500' : 'border-gray-300'}`}
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
              className={`input w-full box-border ${errors.revenue ? 'border-red-500' : 'border-gray-300'}`}
              disabled={isLoading}
            />
            {errors.revenue && <p className="mt-1 text-sm text-red-600">{errors.revenue}</p>}
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary cursor-pointer"
              disabled={isLoading}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="btn-primary cursor-pointer flex items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                Updating...
              </>
            ) : (
              'Update Metrics'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}