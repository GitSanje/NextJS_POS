
'use server';
import { CheckoutState , checkoutSchema} from "./definitions";
import { prisma } from "../../vendor/prisma";



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
       // Extract product IDs from pending carts
       const productIds = pendingCarts.flatMap(cart => cart.productId)
       const deliveryDate = new Date();
       deliveryDate.setDate(deliveryDate.getDate()+3);
       // Create a single order
       const orderQuantity= pendingCarts.reduce(((sum, cart) => sum+ cart.quantity),0);
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