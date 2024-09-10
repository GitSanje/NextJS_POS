import { z } from "zod";




export const checkoutSchema = z.object({
    name: z
    .string()
    .min(3, { message: 'Name must be at least 3 characters long.' })
    .trim(),
    phone: z
    .string()
    .regex(/^\d{10}$/, { message: 'Phone number must be exactly 10 digits.' })
    .trim(),
    email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
    streetaddress: z.string().min(1, { message: "Street address is required" }),
    state: z
    .string()
    .refine((val) => val !== 'Choose State', { message: 'Please select a valid state' }),
    city: z
    .string()
    .refine((val) => val !== 'Choose City', { message: 'Please select a valid city' }),
    paymentMethod: z.enum(['cash', 'khalti'], { message: 'Invalid payment method.' }),


})

export type CheckoutState =
  | {
      errors?: {
        name?: string[];
        phone?: string[];
        email?: string[];
        streetaddress?: string[];
        state?: string[];
        city?: string[];
      };
      message?: string;
    }
  | undefined;
