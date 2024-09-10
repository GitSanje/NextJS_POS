'use server'

import { revalidatePath } from "next/cache"
import { prisma } from "../../vendor/prisma"


export async function deleteOrder(
    
    formData: FormData
): Promise<any> {

    try {

        const data = {
           id: formData.get("id")
        }
        const order = await prisma.order.delete({
            where: {
                id: data?.id as string
            }
        })
    
        revalidatePath('/')
        
    } catch (error) {
        return {
            error: " There was an error on deleting"
        }
    }
    

}