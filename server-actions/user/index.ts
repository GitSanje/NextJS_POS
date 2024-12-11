import { prisma } from "@/vendor/prisma";



export const getUsers = async () => {
  try {
      const users = await prisma.user.findMany({
          select: {
            email: true,
            name: true,
            dob: true,
            role: true,
            
          },
        });

        return users
  } catch (error) {

    return null
    
  }
}