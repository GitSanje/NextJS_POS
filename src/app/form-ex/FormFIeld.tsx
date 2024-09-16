"use client";
import React from 'react';
import * as Form from '@radix-ui/react-form';
import { FieldValues, useForm, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import * as Select from '@radix-ui/react-select';
import { Input } from '@/components/ui/input'; // Make sure to correctly import your Input component

// Define the validation schema using Zod
const schema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  status: z.enum(['available', 'not available'], {
    required_error: 'Status is required',
  }),
});

type FormData = z.infer<typeof schema>;

type FormFieldProps<T extends FieldValues> ={
  name: keyof T;
  label: string;
  type?: string; // input type (text, email, number, etc.)
  placeholder?: string;
  register: UseFormRegister<T>; // ReturnType<typeof useForm>['register'];
  error?: string;
  as?: 'input' | 'select' | 'file'; // to handle different types of inputs
  options?: { label: string; value: string }[]; // options for select input
  setValue?:  UseFormSetValue<T>; // for select input
}

const FormField=  <T extends FieldValues>({
  name,
  label,
  type = 'text',
  placeholder,
  register,
  error,
  as = 'input',
  options,
  setValue,
}: FormFieldProps<T>) => {
  return (
    <Form.Field className="mb-4" name={name as string}>
      <Form.Label className="block text-sm font-medium">{label}</Form.Label>
      <Form.Control asChild>
        {as === 'select' && options && setValue ? (
          <Select.Root onValueChange={(value) => setValue(name as any , value as any)}>
            <Select.Trigger className="w-full p-2 border border-gray-300 rounded bg-white">
              <Select.Value placeholder={placeholder} />
            </Select.Trigger>
            <Select.Content className="bg-white border border-gray-300 rounded">
              {options.map((option) => (
                <Select.Item key={option.value} value={option.value} className="p-2 cursor-pointer">
                  <Select.ItemText>{option.label}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        ) : (
          <Input
            type={type}
            className="w-full"
            {...register(name as any)}
            placeholder={placeholder}
          />
        )}
      </Form.Control>
      {error && <span className="text-red-600 text-sm">{error}</span>}
    </Form.Field>
  );
};

export default FormField
