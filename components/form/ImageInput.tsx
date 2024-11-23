import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import React, { ChangeEvent, ComponentPropsWithRef, useState } from "react";
import { Control, FieldValues, Path, useController } from "react-hook-form";

type ImageInputProps<T extends FieldValues> = ComponentPropsWithRef<"input"> & {
  control: Control<T>;
  name: Path<T>;
  label: string;
  isPending?: boolean;
};
const ImageInput = <T extends FieldValues>(props: ImageInputProps<T>) => {
  const { control, name, label, isPending, disabled, ...rest } = props;
  const { field, fieldState } = useController({
    name,
    control,
  });
  //https://www.javascripttutorial.net/web-apis/javascript-filereader/
  const [imageSrc, setImageSrc] = useState<string | ArrayBuffer | null>(null);
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        field.onChange(file);
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImageSrc(null);
      field.onChange(null);
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <>
          <FormItem {...field}>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <div className={"relative flex items-center  gap-16"}>
                <div
                  className={cn(
                    `flex items-center justify-center  border-dashed border-2 border-indigo-500 rounded-md cursor-pointer bg-gray-100 hover:bg-gray-200 size-24`,
                    fieldState.error && "border-red-500"
                  )}
                >
                  {imageSrc ? (
                    <img
                      src={imageSrc as string}
                      alt="Selected file"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <span className=" text-sm text-gray-500 text-center">No image selected</span>
                  )}
                </div>
                <span className=" flex flex-col text-sm text-gray-700 text-center  ">
                  <div> Drag here</div>
                  <div> or</div>
                  <span className="text-indigo-500">browse</span>
                </span>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  disabled={isPending || disabled}
                />
              </div>
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        </>
      )}
    />
  );
};

export default ImageInput;