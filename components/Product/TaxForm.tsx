"use client";
import React, { startTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { Tax } from "@prisma/client"
import { toast } from 'sonner';

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"

import { Loader2 } from 'lucide-react'
import { addTax, updateTax } from "@/server-actions/tax";
import { taxSchema } from "@/schemas";

interface TaxFormProps {
    tax?: Tax
    // setTax: (tax: Tax) => void
    onCancel: () => void
  }

const TaxForm = ({ tax, onCancel }: TaxFormProps) => {

   
    
  const router = useRouter();
  type taxType = Zod.infer<typeof taxSchema>;

//   const [isPending, startTransition] = useTransition();

  const form = useForm<taxType>({
    resolver: zodResolver(taxSchema),
    mode: "onChange",
    defaultValues: {
      name: tax ? tax.name : "",
      rate: tax?.rate ?? undefined,
      description: tax?.description ?? undefined,
    },
  });
  console.log("from tax form", tax);

  const onSubmit = async (values: taxType) => {
    const formData = new FormData();
    Object.entries(values).forEach((value) => {
      formData.append(value[0], value[1] as string );
    });
    console.log("from tax form: formData", formData);

    startTransition(async () => {
        tax
        ? await updateTax(tax!.id, formData)
        : await addTax(formData)
            .then((data) => {

              if (!data) return;
              if (!data.success) {
                return toast.error(data.error.message);
              }
              toast.success(data.message);
              // setTax(data?.data)
             onCancel();
            
            })
            .catch((error) => {
              console.log(error);
              toast.error("Something went wrong.");
            });
    });
  };



  return (
    <div className=" flex items-center justify-center">
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tax Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter tax name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rate (%)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="Enter tax rate" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
              </FormControl>
              <FormDescription>Enter the tax rate as a percentage (e.g., 10 for 10%)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter tax description (optional)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {tax ? 'Update' : 'Add'} Tax
          </Button>
        </div>
      </form>
    </Form>
    </div>
  );
};

export default TaxForm;
