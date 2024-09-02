import { NextApiRequest , NextApiResponse} from "next";
import { prisma } from "../../../vendor/prisma";



// Handle GET request: Fetch the cart
export async function GET( req: NextApiRequest, res: NextApiResponse) {


    const { userId } = req.query;
   try {
     const cartItems = await prisma.cart.findMany({
         where: { userId: userId as string },
         // include: {product:true, variant: true}
     })
     if (!cartItems) {
         return res.status(404).json({ message: 'Cart not found' });
       }
 
     return  res.status(200).json(cartItems);
   } catch (error) {
    res.status(500).json({ message: 'Failed to fetch cart', error });
   }

}

export async function POST( req:NextApiRequest, res: NextApiResponse){

    const { userEmail, productName, variantName, quantity } =  req.body;
    try {
        // Fetch the user by email
        const  user = await prisma.user.findUnique({
            where: { email: userEmail}
        })
        if (!user) {
             // If the user is not found, return a 404 error
            return res.status(404).json({ error: 'User not found' });
          }
        
        // Fetch the product by name
       const product = await prisma.product.findUnique({
         where: { name: productName  },
       });

       if (!product) {
        // If the product is not found, return a 404 error
        return res.status(404).json({ error: 'Product not found' });
      }
      // Fetch the variant by name and product ID
      const variant = await prisma.variant.findFirst({
        where: {
          name: variantName,
          productId: product.id,
        },
      });

      if (!variant) {
        // If the variant is not found, return a 404 error
        return res.status(404).json({ error: 'Variant not found' });
      }
      // Create the cart item
    const cartItem = await prisma.cart.create({
        data: {
          userId: user.id,
          productId: product.id,
          variantId: variant.id,
          quantity,
        },
      });

       // Return the created cart item as a response
    return res.status(200).json({cartItems:cartItem});

    } catch (error) {

         // Handle any errors that occur during the process
    console.error(error);
    return res.status(500).json({ error: 'An error occurred' });
        
    }
}