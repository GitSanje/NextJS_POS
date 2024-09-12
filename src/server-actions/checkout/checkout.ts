
'use server';
import { CheckoutState , checkoutSchema} from "./definitions";
import { prisma } from "../../vendor/prisma";
import { connect } from "http2";



export async function checkout(
    formstate: CheckoutState,
    formData: FormData
    ):Promise<CheckoutState>{

   
     
    const validatedFields = checkoutSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        state: formData.get('state'),
        city: formData.get('city'),
        streetaddress: formData.get('streetaddress'),
        paymentMethod: formData.get("paymentMethod")
    })

    if(!validatedFields.success){
        return {
            errors: validatedFields.error.flatten().fieldErrors
        }
    }

    const { name, phone, email, streetaddress , state,city, paymentMethod } = validatedFields.data;

    
    // Step 1: Find the user by email
    const user = await prisma.user.findUnique({
        where: {
            email:email
        },
        select:{
            id:true
        }
    })
    if (!user) {
        throw new Error(`User with email ${email} not found`);
      }


    // Step 2: Find pending carts for the user
     const pendingCarts = await prisma.cart.findMany({
        where: {
            status: 'PENDING',
            userId:user.id
            
        },
        include: { product: true }
     })

     


     if (pendingCarts.length === 0) {
        throw new Error('No pending carts found for the user');
      }

     // Step 3: Create or find the payment method

     let paymentMethodRecord = await prisma.paymentMethod.findFirst({
        where: {
            paymentType: paymentMethod
        }
     })
     if (!paymentMethodRecord) {
        paymentMethodRecord = await prisma.paymentMethod.create({
          data: { paymentType: paymentMethod },
        });
      }
   
    const orderQuantity= pendingCarts.reduce(((sum, cart) => sum+ cart.quantity),0);

      // Fetch the product-variant pairs to validate
    //   const filteredCarts = 

    //   const productVariants = await Promise.all(
    //     pendingCarts.map( async cart => {
    //         if( cart.variantId){
    //             const variant = await prisma.variant.findFirst({
    //                 where: {
    //                     id: cart.variantId,
    //                     productId: cart.productId
    //                 }

    //             })

    //             return  variant ? { productId: cart.productId, variantId: cart.variantId } : { productId: cart.productId, variantId: null };
    //         }
    //         return { productId: cart.productId, variantId: null };
    //     })
      
    //   )
      // Filter out invalid variant-product pairs
    //    const validVariantsFiltered = productVariants.filter(Boolean);


    //    // Extract product IDs from pending carts
    //    const productIds = pendingCarts.map(cart => cart.productId)
    //    const variantIds = pendingCarts
    //                        .filter(cart => cart.variantId)// Only keep carts with a variant
    //                        .map(cart => cart.variantId);


       const deliveryDate = new Date();
       deliveryDate.setDate(deliveryDate.getDate()+3);
       
        // Create a single order
        const cartIds = pendingCarts.map(cart => cart.id);

        const productIds = pendingCarts.map(cart => cart.productId)

       const order = await prisma.order.create({
          data: {
            orderDate: new Date(),
            quantity: orderQuantity,
            deliveryDate:deliveryDate ,
            state: state,
            streetAddress: streetaddress,
            city:city,
            userId: user.id,
            paymentMethodId: paymentMethodRecord.id,
            products: {
                connect: productIds.map(id => ({ id })),
            },
        //    variants : {
        //     connect : productVariants.map(pv => ({
        //         id: pv.variantId || null
        //     }))
        //    },
           carts: {
            connect: cartIds.map(id => ({ id }))
           }



          }
       })

     // Step 3: Update the status of the carts to CHECKOUT

     await prisma.cart.updateMany({
        where: {
            id: {
                in: pendingCarts.map(cart=>cart.id),
            },
        },
        data: {
            status: 'CHECKOUT',
        }
     })

    
    console.log(order);
    



    }