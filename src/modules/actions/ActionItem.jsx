import React from 'react';

export default function ActionItem({ action, onToggle, onDelete, disabled }) {
  return (
    <div className={`flex items-center justify-between p-3 border rounded-md ${action.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={action.completed}
          onChange={onToggle}
          disabled={disabled}
          className="h-5 w-5 text-indigo-600 rounded cursor-pointer"
        />
        <p className={`ml-3 ${action.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
          {action.text}
        </p>
      </div>
      
      <button
        onClick={onDelete}
        disabled={disabled}
        className="text-gray-400 hover:text-red-500 cursor-pointer"
        aria-label="Delete action"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
}