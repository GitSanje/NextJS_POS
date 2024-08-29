import React, { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => {
  return (
    //This error occurs because TypeScript needs to be configured to understand JSX syntax.
    <button 
      className={twMerge('w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-700', className)}
      {...props}
    > 
      {children}
    </button>
  );
};

export default Button;
