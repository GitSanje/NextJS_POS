"use server"
import { cache } from "@/lib/cache";
import { prisma } from "@/src/vendor/prisma";


export const getSuppliers = cache(
  async (fromClient:boolean=false) => {
    try {
      const suppliers = await prisma.supplier.findMany({
        select: {
          id: true,
          supplierName: true,
        },
      });
      
      if(fromClient){
        const supplersClient = suppliers.map((sup) =>(
            {  
                id:sup.id,
                label: sup.supplierName,
                value: sup.supplierName.toUpperCase()
            }
        ))
        return supplersClient
      }
      return suppliers;
    } catch (error) {
      console.log(error);

      return null;
    }
  },
  ["admin/suppliers", "getSuppliers"],
  { revalidate: 60 * 60 * 24 }
);
