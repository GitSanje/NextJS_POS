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

const ProductStatusSchema = z.enum(["AVAILABLE", "NOTAVAILABLE"]);
export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  image: imageSchema,
  description: z.string().optional(),
  costPrice: z.string().min(1, "Cost Price required"),
  quantityInStock: z.string().min(1, "Quantity is required"),
  validity: z.string().optional(),
  discount: z.string().optional(),
  salePrice: z.string().min(1, "Cost Price required"),
  margin: z.string().optional(),

  status: z.string(),
  category: z
    .string()
    .refine((val) => val !== "Choose category", {
      message: "Please select a valid city",
    }),

  // suppliers: z
  // .array(z.string().min(1, { message: "Supplier is required" }))
  // .nonempty({ message: "At least one supplier is required" }),
});
