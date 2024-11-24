import React from 'react'
import { useController, Control } from 'react-hook-form'
import { Input } from "@/components/ui/input"

interface FormInputProps {
  name: string
  control: Control<any>
  type?: string
  value?: string
  id?: string
  disabled?: boolean
}

export const FormInput: React.FC<FormInputProps> = ({
  name,
  control,
  type = 'text',
  value,
  id,
  disabled = false,
}) => {
  const {
    field: { onChange, onBlur, value: fieldValue, ref },
  } = useController({
    name,
    control,
    defaultValue: value,
  })

  return (
    <Input
      id={id}
      type={type}
      onChange={onChange}
      onBlur={onBlur}
      value={fieldValue}
      ref={ref}
      disabled={disabled}
      checked={type === 'radio' ? fieldValue === value : undefined}
    />
  )
}

