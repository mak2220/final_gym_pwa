// Button.tsx

import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'ghost' | 'solid';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'solid',
  className = '',
  ...props
}) => {
  const baseStyles =
    'w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-all duration-200';
  const variantStyles =
    variant === 'ghost'
      ? 'text-gray-800 hover:bg-gray-200'
      : 'bg-blue-600 text-white hover:bg-blue-700';

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
