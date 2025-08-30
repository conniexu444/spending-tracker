import React from 'react';
import { InputProps } from '../../types';
import { cn } from '../../utils/cn';

const Input: React.FC<InputProps> = ({
  value,
  onChange,
  placeholder,
  type = 'text',
  className,
  disabled = false,
  required = false,
  'aria-label': ariaLabel,
  ...props
}) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      aria-label={ariaLabel}
      className={cn(
        'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg',
        'bg-white dark:bg-gray-800 text-gray-900 dark:text-white',
        'placeholder-gray-500 dark:placeholder-gray-400',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'transition-colors',
        className
      )}
      {...props}
    />
  );
};

export default Input;