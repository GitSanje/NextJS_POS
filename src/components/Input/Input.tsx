

import React, { DetailedHTMLProps, InputHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';
interface InputProps extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    className?:string,
    classNameInput?:string,
    classNameLabel?:string,
    label?:string,
}

const Input:React.FC<InputProps> = ({className, classNameInput, classNameLabel, label,  ...props }) => {

  const input_field ='text-gray-600 form-control w-full px-3 py-2 border rounded-lg focus:border-indigo-500 focus:outline-none ';
  return (
    <div className={twMerge("mb-4 form-outline", className)}>
      
      <input
        className={twMerge(
          input_field,
          classNameInput
        )}
       
        {...props}
      />
      { label && <label htmlFor={label}  className= {twMerge("block text-gray-500 label", classNameLabel)}>{label}</label>}
    </div>
  );
};

export default Input;