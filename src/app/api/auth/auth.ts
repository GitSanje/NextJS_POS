
'use server';

import { prisma } from "../../../vendor/prisma"
import bcrypt from 'bcrypt';
import { createSession, deleteSession } from './stateless-session';
import {
    FormState,
    LoginFormSchema,
    SignupFormSchema,
  } from './definitions';

import { toast } from 'react-toastify';



import { redirect } from 'next/navigation'
export async function signup(
    state: FormState,
    formData: FormData,
    // router: ReturnType<typeof useRouter>
): Promise<FormState> {

  // 1. Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get('username'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    password: formData.get('password'),
    gender: formData.get('gender'),
    dob: formData.get('dob')
    // passwordConfirm: formData.get('password_confirmation'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
   }
   const { name, phone, email, password , gender,dob} = validatedFields.data;
  
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
  const dobDate = new Date(dob);
    const user = prisma.user.create({
        data:{
            name:name,
            phone:phone,
            email:email,
            password:hashedPassword,
            dob: dobDate,
            gender: gender
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


    //  return { success: true };
    // const userId = user.id;
    // await createSession(userId);
    redirect('/api/auth/signin')
}


// 12345!@Sa

