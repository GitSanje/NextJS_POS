import { z } from "zod";

const EMAIL_SCHEMA = z
  .string()
  .min(1, "Email Address is required.")
  .email("Invalid Email Address.");

const MAX_FILE_SIZE = 5000000;
const imageSchema = z
  .instanceof(File)
  .refine((file) => file.size > 0, {
    message: "Image is required",
  })
  .refine(
    (file) => file.type.startsWith("image/"),
    "Invalid file type. Only image files are allowed."
  )
  .refine(
    (file) => file.size <= MAX_FILE_SIZE,
    "File size should be less than 5MB."
  );


export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  image: imageSchema,
  description: z.string().optional(),
  costPrice: z
  .preprocess((value) => {
    if (typeof value === "string") {
      return parseFloat(value);
    }
    return value;
  }, z.number({
    required_error: "Cost price is required",
  })),

  quantityInStock: z
  .preprocess((value) => {
    if (typeof value === "string") {
      return parseFloat(value);
    }
    return value;
  }, z.number({
    required_error: "quantity  is required",
  })),
  validity: z.string().optional(),
  discount: z.string().optional(),
  salePrice: z.preprocess((value) => {
    if (typeof value === "string") {
      return parseFloat(value);
    }
    return value;
  }, z.number({
    required_error: "Sale price is required",
  })),
  margin: z.string().optional(),

  status: z.enum(["AVAILABLE", "NOTAVAILABLE"], {
    message: "Status is required",
  }),
  category: z.string().refine((val) => val !== "", {
    message: "Please select a valid category",
  }),

  suppliers: z
  .array(
    z.object({
      id: z.string().min(1, { message: "Supplier is required" }),
      supplier: z.string().min(1, { message: "Supplier is required" }),
    })
  )
  .nonempty({ message: "At least one supplier is required" }),

});


const PHONE_SCHEMA = z
.string()
.regex(/^\d{10}$/, { message: 'Phone number must be exactly 10 digits.' })
.trim()

export const supplierSchema = z.object({
  suppliername: z.string().min(1,"suppliername is required"),
  email: EMAIL_SCHEMA,
  phone: PHONE_SCHEMA.optional(),
  addres: z.string().optional(),

})