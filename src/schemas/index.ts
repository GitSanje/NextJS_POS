import { z } from "zod";

const EMAIL_SCHEMA = z
  .string()
  .min(1, "Email Address is required.")
  .email("Invalid Email Address.");


  const fileSchema = z.instanceof(File, { message: "Required"})



const imageSchema = fileSchema.refine(
    file => file.size === 0 || file.type.startsWith("image/")
  )

const ProductStatusSchema = z.enum(['AVAILABLE', 'NOTAVAILABLE']);
export const productSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    image: imageSchema.refine(file => file.size >0, "Required"),
    description: z.string().optional(),
    costPrice: z.number().min(0, 'Cost Price must be non-negative'), 
    quantityInStock: z.number().int().min(0, 'Quantity in Stock must be a non-negative integer'),
    validity: z.string().optional(),
    discount: z.string().optional(), 
    salePrice: z.number().min(0, 'Sale Price must be non-negative').optional(),
    margin: z.string().optional(), 

    status: ProductStatusSchema,

    category: z
    .string()
    .refine((val) => val !== 'Choose category', { message: 'Please select a valid city' }),

    // suppliers: z
    // .array(z.string().min(1, { message: "Supplier is required" }))
    // .nonempty({ message: "At least one supplier is required" }),


  })