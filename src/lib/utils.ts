import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { prisma } from "../vendor/prisma";
import { string } from "zod";


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
  

  
export  function generateInvoiceId() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const uniquePart = Math.floor(1000 + Math.random() * 9000);
  return `INV-${year}${month}-${uniquePart}`;
}

