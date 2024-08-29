
import 'server-only';

import { cache } from 'react'
import { verifySession } from './stateless-session'
import { prisma } from '../../../vendor/prisma';


export const getUser = cache( async() => {
    const session = await verifySession();
    if (!session) return null;
    try {
        const user = await prisma.user.findUnique({
            where: {
              id: session.userId,
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

