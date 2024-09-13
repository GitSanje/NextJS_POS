import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SelectModel } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Control, FieldValues, Path } from "react-hook-form";

type FormInputProps<T extends FieldValues> =
  React.ComponentPropsWithRef<"input"> & {
    control: Control<T>;
    name: Path<T>;
    label: string;
    isPending?: boolean;
    typeInput?: "input" | "select" | "file";
    options?: { label: string; value: string }[];
    defaultValue?: string;
  };

const FormInput = <T extends FieldValues>(props: FormInputProps<T>) => {


  const {
    control,
    name,
    label,
    typeInput = "input",
    options = [],
    isPending,
    disabled,
    defaultValue,
    ...rest
  } = props;

//https://www.javascripttutorial.net/web-apis/javascript-filereader/
  const [imageSrc, setImageSrc] = useState<string | ArrayBuffer | null>(null);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target);
    
    const file = event.target.files?.[0];
    if(file){
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc( reader.result)
      }
      reader.readAsDataURL(file);
      
    }
  }

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {typeInput === "select" ? (
              <SelectModel
                {...field}
                {...rest}
                options={options}
                value={field.value}
                onChange={(value) => {field.onChange(value)}}
                defaultValue={defaultValue}
              />
            ) : typeInput === "file" ? (
             


              <div className="relative flex items-center  gap-16">

               <div
                className=" flex items-center justify-center  border-dashed border-2 
                border-indigo-500 rounded-md cursor-pointer bg-gray-100 hover:bg-gray-200 size-24"
              >{imageSrc ? (
                <img
                  src={imageSrc as string}
                  alt="Selected file"
                  className="object-cover w-full h-full"
                />
              ) : ""}
              
              </div>
                <span className=" flex flex-col text-sm text-gray-700 text-center  ">
                 <div > Drag here</div> 
                  <div> or</div> 
                  <span className="text-indigo-500">browse</span>
                </span>
                <input
                  {...field}
                  {...rest}
                  type="file"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  disabled={isPending || disabled}
                />
              </div>
            ) : (
              <Input
                {...field}
                {...rest}
                className={cn(fieldState.error && "border-red-500")}
                disabled={isPending || disabled}
              />
            )}
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
};

export default FormInput;

