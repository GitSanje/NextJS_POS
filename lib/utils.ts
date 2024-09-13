import { Response, ResponseWithMessage } from "@/src/types"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}




// Overload for response status in server action
export function response(response: ResponseWithMessage): Response;
export function response<T extends Record<string, unknown>>(response: Response<T>): Response<T>;
export function response<T extends object>(response: T): T {
  return response;
}
