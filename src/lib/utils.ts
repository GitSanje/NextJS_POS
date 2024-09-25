import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";


export function cn(...inputs: ClassValue[]){
    return twMerge(clsx(inputs))
}

export const formatOrderDate = (dateString: string | undefined) => {
    if (!dateString) return ''; 
    
    const date = new Date(dateString);
    
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };
  

  