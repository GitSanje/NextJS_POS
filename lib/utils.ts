import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { prisma } from "../vendor/prisma";
import { string } from "zod";
import { ResponseWithMessage,Response } from "@/types";


export function cn(...inputs: ClassValue[]){
    return twMerge(clsx(inputs))
}


  // Overload for response status in server action
export function response(response: ResponseWithMessage): Response;
export function response<T extends Record<string, unknown>>(response: Response<T>): Response<T>;
export function response<T extends object>(response: T): T {
  return response;
}

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

export async function generateInvoiceId() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const uniquePart = Math.floor(1000 + Math.random() * 9000);
  return `INV-${year}${month}-${uniquePart}`;
}


export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export function convertToCapitalized(str: string) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export const formatOrderDate = (dateString: Date | undefined) => {
  if (!dateString) return ''; 
  
  const date = new Date(dateString);
  
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};