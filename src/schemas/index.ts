import { z } from "zod";

const EMAIL_SCHEMA = z
  .string()
  .min(1, "Email Address is required.")
  .email("Invalid Email Address.");

  const MAX_FILE_SIZE = 5000000;

  const imageSchema = z
    .union([
      z.instanceof(File).refine(
        (file) => file.type.startsWith("image/"),
        "Invalid file type. Only image files are allowed."
      ).refine(
        (file) => file.size <= MAX_FILE_SIZE,
        "File size should be less than 5MB."
      ),
      z.string(), 
    ]);
  

export const numberSchema = ({
  required = false, // Determines if the field is required
  required_error = "This field is required", // Custom error message for required fields
} = {}) => {
  const error = required ? { required_error } : {}; // Conditionally apply the required error
  const schema = z.number(error);

  let finalSchema = z.preprocess((value) => {
    if (typeof value === "string") {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? undefined : parsed;
    }
    return value;
  }, schema);

  // If the field is not required, make it optional
  if (!required) {
    return finalSchema.optional();
  }

  return finalSchema;
};

export const productSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    image: imageSchema.optional(),
    imageUrl: z.string().url("Please enter a valid URL").optional(),
    description: z.string().optional(),

    taxRate: z.string().optional(),

    costPrice: numberSchema({
      required: true, // Cost price is required
      required_error: "Cost price is required",
    }),

    quantityInStock: numberSchema({
      required: true, // Quantity in stock is required
      required_error: "Quantity is required",
    }),

    validity: z.string().optional(),

    discount: numberSchema({
      required: false, // Discount is optional
    }),

    salePrice: numberSchema({
      required: true, // Sale price is required
      required_error: "Sale price is required",
    }),

    margin: z.string().optional(),

    category: z.string().refine((val) => val !== "", {
      message: "Please select a valid category",
    }),

    tax: z.string().optional(),

    suppliers: z
      .array(
        z.object({
          id: z.string().min(1, { message: "Supplier is required" }),
          supplier: z.string().min(1, { message: "Supplier is required" }),
        })
      )
      .nonempty({ message: "At least one supplier is required" }),
  })
  .refine((data) => data.image || data.imageUrl, {
    message: "Either an image or image URL is required",
    path: ["imageUrl"], // Path to show the error
  })
  .refine((data) => data.tax || data.taxRate, {
    message: "Either a tax or tax rate is required",
    path: ["taxRate"], // Path to show the error
  });

const PHONE_SCHEMA = z
  .string()
  .regex(/^\d{10}$/, { message: "Phone number must be exactly 10 digits." })
  .trim();

export const supplierSchema = z.object({
  suppliername: z.string().min(1, "suppliername is required"),
  email: EMAIL_SCHEMA,
  phone: PHONE_SCHEMA.optional(),
  addres: z.string().optional(),
});

export const taxSchema = z.object({
  name: z.string().min(1, "Tax name is required"),
  rate: numberSchema({
    required: true,
    required_error: "Rate  is required",
  }),
  description: z.string().optional(),
});
