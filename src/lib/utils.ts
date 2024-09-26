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
  

  // Convert Uint8Array to String
export const uint8ArrayToString = (uint8Array: ArrayBuffer) => {
  const decoder = new TextDecoder('utf-8'); 
  return decoder.decode(uint8Array);
};

// Convert String to Uint8Array
export const stringToUint8Array = (stringBuffer: string) => {
  const encoder = new TextEncoder(); // Default encoding is 'utf-8'
  return encoder.encode(stringBuffer);
};


export const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

export  function generateInvoiceId() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const uniquePart = Math.floor(1000 + Math.random() * 9000);
  return `INV-${year}${month}-${uniquePart}`;
}

