export const dynamic = 'force-dynamic'
import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../vendor/prisma";
import { revalidatePath } from "next/cache";



// Handle GET request: Fetch the cart
export async function GET(request:  NextRequest) {
  const token = request.cookies.get('token')
  console.log(token, "token from get cart");
  

  try {
    // Parse the request URL and extract the query parameters
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const cartItems = await prisma.cart.findMany({
      where: { userId: userId as string,
        status: "PENDING"
       },
      include: {
        product: {

          select: {
            discount:true,
            salePrice:true,
            name:true,
            tax:{
              select:{
                rate:true
              }
            }
          }
        },  
        variants: {
          include:{
            option:true,
            variant:true
          }
        }
      }
    });
    console.log(cartItems);
    
    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });
    }
    

    
    


   // Return the cart items
   return NextResponse.json({ cartItems:  cartItems}, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch cart", error }, { status: 500 });
  }
}
type AddItemRequest = {
  userId: string;
   productId: string ;
    amount?:number;
    productVariantIds?: (string | undefined)[];
    quantity: number
};


// export async function POST(req: NextRequest ) {
//   const {userId,quantity, productId, productVariantIds,amount} = await req.json() as AddItemRequest;

  
//   try {

//     // Create the cart item
//     const cartItems = await prisma.cart.create({ 
//       data: {
//         userId: userId,
//         productId: productId ,
//         variants:   productVariantIds && productVariantIds.length > 0 ? {
//           connect: productVariantIds.map(id => ({ id }))
//         }: undefined,
//         quantity,
//         amount: (amount?? 0) * quantity
        
//       },
//     });
    

   
//     // Return the created cart item as a response
//     return NextResponse.json({ cartItems: cartItems }, { status: 200 });
//   } catch (error) {
//     // Handle any errors that occur during the process
//     console.error(error,'error');
//     return NextResponse.json({ message: "An error occured" }, { status: 500 });
//   }
// }

// export async function DELETE(req: NextRequest) {
//   const { cartId } = await req.json();

  
//   try {
//     if (!cartId) {
     
//       return NextResponse.json({ message:  "Item ID is required"}, { status: 500 });
//     }

//     // Remove the item from the cart
//     const deletedItem = await prisma.cart.delete({
//       where: { id: cartId },
//     });

//     // Fetch the updated cart items for the user 
//     // const cartItems = await prisma.cart.findMany({
//     //   where: {
//     //     userId: deletedItem.userId, 
//     //   },
//     //   include: {
//     //     product: true,
//     //     variant: true,
//     //   },
//     // });

//     revalidatePath('/')

//     return NextResponse.json({ cartItems: cartItems }, {status: 200});
//   } catch (error) {
//     console.error("Failed to remove item from cart:", error);
//     return NextResponse.json({ error: "Failed to remove item from cart" },  {status: 500});
//   }
// }
