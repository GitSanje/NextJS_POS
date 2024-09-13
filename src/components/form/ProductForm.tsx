"use client";

import { productSchema } from "@/src/schemas";

import { FormEvent, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import * as Select from "@radix-ui/react-select";
import FormInput from "./FormInput";
import Modal from "@/components/ui/model";
import { Spinner } from "@/components/ui/Spinner";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { SelectModel } from "@/components/ui/select";
import { addProduct } from "@/src/server-actions/product/product";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const suppliersList = [
  { id: "supplier1", name: "Supplier 1" },
  { id: "supplier2", name: "Supplier 2" },
  { id: "supplier3", name: "Supplier 3" },
];
const categories = [
  { label: "category1", value: "Category 1" },
  { label: "category2", value: "Category 2" },
];
const productstatus = [
  { label: "Available", value: "AVAILABLE" },
  { label: "Not Available", value: "NOTAVAILABLE" },
];
const ProductForm: React.FC = () => {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      image: undefined,
      costPrice: "",
      quantityInStock: "",
      validity: "",
      discount: "",
      salePrice: "",
      margin: "",
      status: "",
      category: "",
      //suppliers: [],
    },
  });

  // const {
  //   control,

  //   formState: { errors },
  // } = form;
  let [saving, setSaving] = useState(false);

  const handleSubmit = form.handleSubmit((values) => {
    console.log(values);
    
    setSaving(true)
    startTransition(() => {
      addProduct(values)
        .then((data) => {
          if (!data) return;
          if (!data.success) {
            return toast.error(data.error.message);
          }
          return router.push("/admin/products");
        })
        .catch(() => toast.error("Something went wrong."));
    });
  });
  // const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
  //   // event.preventDefault();
  //   // console.log(Object.fromEntries(new FormData(event.currentTarget)));
  // };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit}>
        <fieldset disabled={saving} className="group">
          <FormInput
            control={form.control}
            name="image"
            label="Image"
            typeInput="file"
            isPending={isPending}
          />

          <div className="flex flex-row space-y-6 gap-4">
            <div className="space-y-4 ">
              <FormInput
                control={form.control}
                name="name"
                label="Product Name"
                type="text"
                placeholder="Enter product name"
                isPending={isPending}
              />
              <FormInput
                control={form.control}
                name="description"
                label="Description"
                type="text"
                placeholder="Enter product description"
                isPending={isPending}
              />
              <FormInput
                control={form.control}
                name="costPrice"
                label="Cost Price"
                type="number"
                placeholder="Enter cost price"
                isPending={isPending}
              />

              <FormInput
                control={form.control}
                name="quantityInStock"
                label="Quantity in Stock"
                type="number"
                placeholder="Enter quantity in stock"
                isPending={isPending}
              />
              <FormInput
                control={form.control}
                name="validity"
                label="Validity"
                type="text"
                placeholder="Enter validity period"
                isPending={isPending}
              />
            </div>
            <div className="space-y-4">
              <FormInput
                control={form.control}
                name="discount"
                label="Discount"
                type="text"
                placeholder="Enter discount"
                isPending={isPending}
              />
              <FormInput
                control={form.control}
                name="salePrice"
                label="Sale Price"
                type="number"
                placeholder="Enter sale price"
                isPending={isPending}
              />

              <FormInput
                control={form.control}
                name="margin"
                label="Margin"
                type="text"
                placeholder="Enter margin"
                isPending={isPending}
              />

              {/* Status Select */}
              {/* <Controller
                control={form.control}
                name="status"
                render={({ field }) => (
                  <SelectModel
                    {...field}
                    onChange={field.onChange}
                    options={productstatus}
                    defaultValue="Select a status ..."
                    label="Status"
                    name="status"
                  />
                )}
              />
              <Controller
            name="category"
            control={form.control}
            render={({ field }) => (
              <Select.Root onValueChange={field.onChange}>
                <Select.Trigger >
                     <Select.Value  placeholder="Expense Category"/>
                  </Select.Trigger>
                <Select.Content>
                  {categories.map((category) => (
                    <Select.Item key={category.label} value={category.value}>
                      {category.label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
        )}
      /> */}

              {/* Status Category
              <FormInput
                control={form.control}
                name="category"
                label="Category"
                typeInput="select"
                options={categories}
                defaultValue="Select a category ..."
              /> */}
            </div>
          </div>

          <div className="mt-8 space-x-6 text-right">
            <Modal.Close className="rounded px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-600">
              Cancel
            </Modal.Close>

            <Button
              type="submit"
              className="inline-flex items-center justify-center rounded bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600 group-disabled:pointer-events-none"
            >
              <Spinner className="absolute h-4 group-enabled:opacity-0" />
              <span className="group-disabled:opacity-0">Save</span>
            </Button>
          </div>
        </fieldset>
      </form>
    </Form>
  );
};

export default ProductForm;
