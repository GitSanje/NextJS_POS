"use server"

import { cache } from 'react'
import { prisma } from '../vendor/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../app/api/auth/[...nextauth]/options';


export const getUser = cache( async() => {
    const session = await getServerSession(authOptions)
    if (!session) return null;
    try {
        const user = await prisma.user.findUnique({
            where: {
              id: session?.user.id,
            },
            select: {
              id: true,
              name: true,
              email: true,
            },
          });
          
          return user;
          
        
    } catch (error) {
        console.log('Failed to fetch user');
    return null;
    }
}

     
)





export const getUserSession = async () => {
    const session = await getServerSession( authOptions)

    return session?.user.id
}