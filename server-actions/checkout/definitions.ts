import { z } from "zod";




export const checkoutSchema = z.object({
    name: z
    .string()
    .min(3, { message: 'Name must be at least 3 characters long.' }),
    // phone: z
    // .string()
    // .regex(/^\d{10}$/, { message: 'Phone number must be exactly 10 digits.' })
    // .trim(),
    email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
    streetaddress: z.string().min(1, { message: "Street address is required" }),
    state: z
    .string()
    .min(3, { message: 'please enter the state name' }),
    city: z
    .string().min(3, { message: 'please enter the city name' })
   ,
    paymentMethod: z.enum(['cash', 'stripe','khalti'], { message: 'Invalid payment method.' }),
   


})


export type checkoutType = {
  streetaddress: string;
  state: string;
  city: string;
  paymentMethod: string | undefined;
  name: string;
  email: string;
}
export type CheckoutState =
  | {
      errors?: {
        name?: string[];
        email?: string[];
        streetaddress?: string[];
        state?: string[];
        city?: string[];
      };
      message?: string;
    }
  | undefined;

