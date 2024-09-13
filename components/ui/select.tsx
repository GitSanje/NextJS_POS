
//https://chatgpt.com/c/66e3be55-1fe0-8003-b7d0-c76b0f4c4efa

import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import * as Select from '@radix-ui/react-select'
interface SelectProps  {
    options: { label: string, value: string}[],
    value: string;
    name:string;
    onChange: (value: any) => void;
    defaultValue?: string;
    label?: string;
}

const SelectModel: React.FC<SelectProps>= ({ options, value, name, onChange, defaultValue ,label}) => {
   console.log(value,'selectmodel');
   
    return(
        <Select.Root
       name={name}
       onValueChange={(value) => onChange({ target: { name, value } })}
        value={value}
      >
        <Select.Trigger className="p-2 border-2 border-indigo-500 rounded-md flex gap-4 items-center text-sm text-gray-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out">
        <Select.Value placeholder={defaultValue || 'Select an option...'} 
        />
          <Select.Icon className="text-gray-500">
            <ChevronDownIcon />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content
          side='bottom'
          align='start'
          sideOffset={5}
           className=" mt-2 w-full bg-white shadow-lg rounded-md border border-gray-300 z-50">
            <Select.ScrollUpButton className="flex items-center justify-center p-2 hover:bg-gray-100">
              <ChevronUpIcon />
            </Select.ScrollUpButton>
            <Select.Viewport className="p-2">
              <Select.Group>
                <Select.Label className="px-2 py-1 text-xs text-gray-500">
                  { label || ""}
                </Select.Label>
                {options.map((option) => (
                <Select.Item
                  key={option.value}
                  value={option.value}
                  className="p-2 rounded-md text-sm text-gray-700 hover:bg-indigo-500 hover:text-white cursor-pointer"
                >
                  {option.label}
                </Select.Item>
              ))}
              </Select.Group>
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    )

}

  

SelectModel.displayName = "SelectModel"

export { SelectModel}


