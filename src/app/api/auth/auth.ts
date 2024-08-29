
'use server';

import { prisma } from "../../../vendor/prisma"
import bcrypt from 'bcrypt';
import { createSession, deleteSession } from './stateless-session';
import {
    FormState,
    LoginFormSchema,
    SignupFormSchema,
  } from './definitions';



export async function signup(
    state: FormState,
    formData: FormData
): Promise<FormState> {

  // 1. Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get('username'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    password: formData.get('password'),
    passwordConfirm: formData.get('password_confirmation'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
   }
   const { name, phone, email, password } = validatedFields.data;
  
   const existingUser = await prisma.user.findUnique({
    where: {
        email: email
    }
   })

   if (existingUser) {
    return {
      message: 'Email already exists, please use a different email or login.',
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10)
    const user = prisma.user.create({
        data:{
            name:name,
            phone:phone,
            email:email,
            password:hashedPassword,

        }
    })
    const account = await prisma.account.create({
      data: { 
      userId: (await user).id,
       type: 'credentials',
       provider: 'credentials',
       providerAccountId: (await user).id
     }})


    if (!user && !account) {
        return {
          message: 'An error occurred while creating your account.',
        };
      }

    const userId = user.id;
    await createSession(userId);
}


// 

