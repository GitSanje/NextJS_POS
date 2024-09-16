// "use client";
// import React from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import * as Form from "@radix-ui/react-form"; // Ensure these are from Radix UI or replaced with appropriate components
// import { Input } from "@/components/ui/input";

// import { SelectModel } from "@/components/ui/select";
// import ImageInput from "@/src/components/form/ImageInput";

// // Define the validation schema using Zod
// const MAX_FILE_SIZE = 5000000;

// const imageSchema = z
//   .instanceof(File)
//   .refine((file) => file.size > 0, {
//     message: "Image is required",
//   })
//   .refine(
//     (file) => file.type.startsWith("image/"),
//     "Invalid file type. Only image files are allowed."
//   )
//   .refine(
//     (file) => file.size <= MAX_FILE_SIZE,
//     "File size should be less than 5MB."
//   );

// const schema = z.object({
//   name: z.string().min(1, { message: "Name is required" }),
//   email: z.string().email({ message: "Invalid email address" }),
//   status: z.enum(["AVAILABLE", "NOTAVAILABLE"], {
//     required_error: "Status is required",
//   }),
//   image: imageSchema,
// });

// type FormData = z.infer<typeof schema>;

// const Page = () => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     setValue,
//     control,
//   } = useForm<FormData>({
//     resolver: zodResolver(schema),
//   });

//   const onSubmit = (data: FormData) => {
//     console.log(data);
//   };

//   return (
//     <Form.Root onSubmit={handleSubmit(onSubmit)} className="p-4">
//       {/* Image Field */}
//       <ImageInput
//         control={control}
//         name="image"
//         label="Image"
//       />

//       {/* Email Field */}
//       <Form.Field className="mb-4" name="email">
//         <Form.Label className="block text-sm font-medium">Email</Form.Label>
//         <Form.Control asChild>
//           <Input
//             className="w-full"
//             {...register("email")}
//             placeholder="Enter your email"
//             type="email"
//           />
//         </Form.Control>
//         {errors.email && (
//           <span className="text-red-600 text-sm">{errors.email.message}</span>
//         )}
//       </Form.Field>

//       {/* Status Select Field */}
//       {/* <Form.Field className="mb-4" name="status">
//         <Form.Label className="block text-sm font-medium">Status</Form.Label>
//         <Form.Control asChild>
//           <SelectModel
//             control={control}
//             name="status"
//             label="Status"
//             options={productstatus}
//           />
//         </Form.Control>
//         {errors.status && (
//           <span className="text-red-600 text-sm">{errors.status.message}</span>
//         )}
//       </Form.Field> */}

//       {/* Submit Button */}
//       <Form.Submit asChild>
//         <button className="w-full p-2 bg-blue-500 text-white rounded mt-4">
//           Submit
//         </button>
//       </Form.Submit>
//     </Form.Root>
//   );
// };

// export default Page;
