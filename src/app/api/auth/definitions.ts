

import { z } from 'zod';

const genderOptions = ['Male', 'Female', 'Other'] as const;

console.log(genderOptions);

export const SignupFormSchema = z.object({
  
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long.' })
    .trim(),
  email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
  password: z
    .string()
    .min(8, { message: 'Be at least 8 characters long' })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    .regex(/[0-9]/, { message: 'Contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Contain at least one special character.',
    })
    .trim(),
phone: z
    .string()
    .regex(/^\d{10}$/, { message: 'Phone number must be exactly 10 digits.' })
    .trim(),
  // passwordConfirm: z.string().trim(),
  gender: z.enum(genderOptions, { message: 'Select a valid gender' }),
  dob: z
  .string()
  .refine((date) => {
    const parsedDate = Date.parse(date);
    if (isNaN(parsedDate)) {
      return false; // Invalid date
    }

    const dobDate = new Date(parsedDate);
    const currentYear = new Date().getFullYear();
    const dobYear = dobDate.getFullYear();

    return currentYear - dobYear > 15; // Must be greater than 15 years old
  }, { message: 'You must be at least 15 years old.' }),

});

// .refine((data) => data.password === data.passwordConfirm, {
//   path: ['passwordConfirm'],
//   message: 'Passwords do not match.',
// });

export const LoginFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password field must not be empty.' }),
});

export type FormState =
  | {
      errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
        dob?: string[];
        gender?: string[];
      };
      message?: string;
    }
  | undefined;

export type SessionPayload = {
  userId: string | number;
  expiresAt: Date;
};