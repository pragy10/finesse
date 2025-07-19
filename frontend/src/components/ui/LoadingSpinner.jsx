import React from 'react';

const LoadingSpinner = ({ size = 'md', className = '', color = 'primary' }) => {
  const sizeClasses = {
    xs: 'w-3 h-3 border',
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2', 
    lg: 'w-8 h-8 border-2',
    xl: 'w-12 h-12 border-4'
  };

  const colorClasses = {
    primary: 'border-gray-200 border-t-primary-500',
    secondary: 'border-gray-200 border-t-secondary-500',
    white: 'border-white/30 border-t-white',
    gray: 'border-gray-300 border-t-gray-600'
  };

  return (
    <div className={`
      ${sizeClasses[size]} 
      ${colorClasses[color]} 
      rounded-full animate-spin 
      ${className}
    `} />
  );
};

export default LoadingSpinner;
