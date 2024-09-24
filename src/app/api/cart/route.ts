
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../vendor/prisma";
import { revalidatePath } from "next/cache";
import { connect } from "http2";


// Handle GET request: Fetch the cart
export async function GET(request:  NextRequest) {
 

  try {
    // Parse the request URL and extract the query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
  

    const cartItems = await prisma.cart.findMany({
      where: { userId: userId as string },
      include: {
        product: true,  // Include product details
        variants: {
          include:{
            option:true,
            variant:true
          }
        }
      }
    });
    
    console.log(JSON.stringify(cartItems, null, 2));
    

    
    // Calculate the subtotal
    const subtotal =  cartItems.reduce( (total, item) => {
      let var_opt;
      if(item.variants.length > 0 && item.status ==="PENDING"){
         item.variants.map((var_product) => {
          if(var_product.variant.name === "Size"){
            var_opt = var_product.salePrice
          }
          var_opt = var_product.salePrice
        })
      }
      console.log(var_opt,'var_product');
      const price = var_opt !== undefined ? var_opt :
      item.variants.length==0 &&item.status==="PENDING" ?item.product?.salePrice ?? 0: 0 ;

      // const price =  item.variants.length > 0 &&item.status==="PENDING" ?
      //  item.variants[0]?.salePrice ?? 0:
      //   item.variants.length==0 &&item.status==="PENDING" ?item.product?.salePrice ?? 0: 0 ;
      
      return total + (price * (item.quantity || 0))
    },0)

    const pendingTotal = cartItems.reduce((total, item) =>{
      const status = item.status=="PENDING" ? 1: 0
      return total + status

    },0 )
     
    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });
    }

   // Return the cart items
   return NextResponse.json({ cartItems:  cartItems, subtotal :subtotal, pendingTotal: pendingTotal}, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch cart", error }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { userId, productId, productVariantIds, quantity } = await req.json();

  
  try {
    // // Fetch the user by email
    // const user = await prisma.user.findUnique({
    //   where: { email: userEmail },
    // });
    // if (!user) {
    //   // If the user is not found, return a 404 error
    //   return NextResponse.json({ message: "User not found" }, { status: 404 });
    // }

    // Fetch the product by name
    // const product = await prisma.product.findFirst({
    //   where: {
    //      name: {equals: productName, mode:'insensitive'}
        
    //     },
    // });

    // if (!product) {
    //   // If the product is not found, return a 404 error
    //   return NextResponse.json({ message: "Product not found" }, { status: 404 });
    // }
    // // Fetch the variant by name and product ID
    // const variant = await prisma.variant.findFirst({
    //   where: {
    //     name: { equals: variantName, mode: 'insensitive'},
    //     productId: product.id,
    //   },
    // });

    // if (!variant) {
    //   // If the variant is not found, return a 404 error
    //   return NextResponse.json({ message: "Variant not found" }, { status: 404 });
    // }

    // Create the cart item
    const cartItems = await prisma.cart.create({ 
      data: {
        userId: userId,
        productId: productId,
        variants: {
          connect: productVariantIds.map(id => ({ id }))
        },
        quantity,
      },
    });
    
   console.log(cartItems);
   
    // Return the created cart item as a response
    return NextResponse.json({ cartItems: cartItems }, { status: 200 });
  } catch (error) {
    // Handle any errors that occur during the process
    console.error(error,'error');
    return NextResponse.json({ message: "An error occured" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { cartId } = await req.json();

  
  try {
    if (!cartId) {
     
      return NextResponse.json({ message:  "Item ID is required"}, { status: 500 });
    }

    // Remove the item from the cart
    const deletedItem = await prisma.cart.delete({
      where: { id: cartId },
    });

    // Fetch the updated cart items for the user 
    const cartItems = await prisma.cart.findMany({
      where: {
        userId: deletedItem.userId, 
      },
      include: {
        product: true,
        variant: true,
      },
    });

    revalidatePath('/')

    return NextResponse.json({ cartItems: cartItems }, {status: 200});
  } catch (error) {
    console.error("Failed to remove item from cart:", error);
    return NextResponse.json({ error: "Failed to remove item from cart" },  {status: 500});
  }
}
