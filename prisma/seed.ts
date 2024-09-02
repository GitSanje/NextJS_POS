import { PrismaClient } from "@prisma/client";
import { hash } from 'bcrypt'

//https://chatgpt.com/c/b05f382c-8f81-49bd-90d0-9cc4b0593261
const prisma = new PrismaClient()


async function main() {

    const password = await hash('test', 12)

    const user = await prisma.user.upsert({
        where: { email: 'test@test.com' },
        update: {},
        create: {
            email: 'test@test.com',
            name: 'Test User',
            password
          }
    })

    const account = await prisma.account.create({
        data: { userId: user.id,
         type: 'credentials',
         provider: 'credentials',
         providerAccountId: user.id
    }})

    // Second user (sanjay@gmail.com)
  const user2 = await prisma.user.create({
    data: {
      email: 'sanjay@gmail.com',
      name: 'Sanjay Karki',
      phone: '9876543210',  
      password: password,
      dob: new Date('1995-01-01'), 
      gender: 'Male',  // Example gender
    
    },
  });

  const account2 = await prisma.account.create({
    data: {
      userId: user2.id,
      type: 'credentials',
      provider: 'credentials',
      providerAccountId: user2.id,
    },
  });

    // Create Categories
    const categories = await prisma.category.createMany({
        data: [
          { categoryName: 'Electronics', description: 'Devices and gadgets' },
          { categoryName: 'Clothing', description: 'Apparel and accessories' },
          { categoryName: 'Books', description: 'Books and literature' },
          { categoryName: 'Furniture', description: 'Home and office furniture' },
          { categoryName: 'Groceries', description: 'Food and household items' },
        ],
      });

     // Create Products
  const products = await prisma.product.createMany({
    data: [
      {
        name: 'Smartphone',
        description: 'Latest smartphone with cutting-edge features',
        costPrice: 500,
        quantityInStock: 100,
        salePrice: 600,
        margin: '20%',
        categoryId: (await prisma.category.findUnique({ where: { categoryName: 'Electronics' } }))?.id!,
      },
      {
        name: 'T-shirt',
        description: 'Cotton t-shirt in various sizes',
        costPrice: 10,
        quantityInStock: 200,
        salePrice: 15,
        margin: '50%',
        categoryId: (await prisma.category.findUnique({ where: { categoryName: 'Clothing' } }))?.id!,
      },
      {
        name: 'Office Chair',
        description: 'Ergonomic office chair',
        costPrice: 100,
        quantityInStock: 50,
        salePrice: 150,
        margin: '33%',
        categoryId: (await prisma.category.findUnique({ where: { categoryName: 'Furniture' } }))?.id!,
      },
      {
        name: 'Fiction Novel',
        description: 'Best-selling fiction novel',
        costPrice: 5,
        quantityInStock: 300,
        salePrice: 10,
        margin: '50%',
        categoryId: (await prisma.category.findUnique({ where: { categoryName: 'Books' } }))?.id!,
      },
      {
        name: 'Pasta',
        description: 'Italian pasta, 500g pack',
        costPrice: 2,
        quantityInStock: 400,
        salePrice: 3,
        margin: '33%',
        categoryId: (await prisma.category.findUnique({ where: { categoryName: 'Groceries' } }))?.id!,
      },
    ],
  });

   // Create Variants
   const productsList = await prisma.product.findMany();
   const variants = await prisma.variant.createMany({
    data: [
      {
        name: 'Smartphone - Black, 128GB',
        salePrice: 620,
        priceDifference: 20,
        status: 'In Stock',
        costPrice: 510,
        productId: productsList[0].id,
      },
      {
        name: 'Smartphone - White, 256GB',
        salePrice: 650,
        priceDifference: 50,
        status: 'In Stock',
        costPrice: 520,
        productId: productsList[0].id,
      },
      {
        name: 'T-shirt - Large, Blue',
        salePrice: 16,
        priceDifference: 1,
        status: 'In Stock',
        costPrice: 11,
        productId: productsList[1].id,
      },
      {
        name: 'Office Chair - Black',
        salePrice: 155,
        priceDifference: 5,
        status: 'In Stock',
        costPrice: 105,
        productId: productsList[2].id,
      },
      {
        name: 'Pasta - Gluten-Free',
        salePrice: 4,
        priceDifference: 1,
        status: 'Limited Stock',
        costPrice: 2.5,
        productId: productsList[4].id,
      },
    ],
  });

  // Create Inventory for Products
  const inventory = await prisma.inventory.createMany({
    data: [
      {
        status: 'In Stock',
        quantity: 100,
        restockDate: new Date('2024-10-01'),
        location: 'Warehouse 1',
        productId: productsList[0].id,
      },
      {
        status: 'In Stock',
        quantity: 200,
        restockDate: new Date('2024-09-20'),
        location: 'Warehouse 2',
        productId: productsList[1].id,
      },
      {
        status: 'In Stock',
        quantity: 50,
        restockDate: new Date('2024-11-05'),
        location: 'Warehouse 3',
        productId: productsList[2].id,
      },
      {
        status: 'Out of Stock',
        quantity: 0,
        restockDate: new Date('2024-12-01'),
        location: 'Warehouse 4',
        productId: productsList[3].id,
      },
      {
        status: 'In Stock',
        quantity: 400,
        restockDate: new Date('2024-09-15'),
        location: 'Warehouse 5',
        productId: productsList[4].id,
      },
    ],
  });

  // Create Carts 
  const cart = await prisma.cart.createMany({
    data: [
      {
        userId: (await prisma.user.findUnique({ where: { email:"test@test.com"}}))?.id!,
        quantity: 2,
        productId: productsList[0].id,
        variantId: (await prisma.variant.findFirst({ where: { name: 'Smartphone - Black, 128GB' } }))?.id!,
      },
      {
        userId: (await prisma.user.findUnique({ where: { email:"test@test.com"}}))?.id!,
        quantity: 1,
        productId: productsList[1].id,
        variantId: (await prisma.variant.findFirst({ where: { name: 'T-shirt - Large, Blue' } }))?.id!,
      },
      {
        userId: (await prisma.user.findUnique({ where: { email:"sanjay@gmail.com "}}))?.id!,
        quantity: 1,
        productId: productsList[2].id,
        variantId: (await prisma.variant.findFirst({ where: { name: 'Office Chair - Black' } }))?.id!,
      },
      {
        userId: (await prisma.user.findUnique({ where: { email:"sanjay@gmail.com "}}))?.id!,
        quantity: 3,
        productId: productsList[4].id,
        variantId: (await prisma.variant.findFirst({ where: { name: 'Pasta - Gluten-Free' } }))?.id!,
      },
    ],
  });


  console.log('Users and accounts created:', { user, user2, account, account2 });
    
}

main()
   .then(()=> prisma.$disconnect())
   .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })