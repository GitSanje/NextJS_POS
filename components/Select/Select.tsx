


interface SelectOption {
    value: string;
    label: string;
  }


interface SelectProps {
    id: string;
    name: string;
    label: string;
    value: string;
    placeholder: string;
    options: SelectOption[];
    onChange: (e: any) => void;
}


const Select: React.FC<SelectProps> = ({
    id,
    name,
    label,
    value,
    placeholder,
    options,
    onChange,
  }) => {

    return (
<div className="mb-4">
  <label
    htmlFor={id}
    className="block text-sm font-medium text-gray-600 mb-2 capitalize "
  >
    {label}
  </label>
  <select
    id={id}
    name={name}
    value={value}
    onChange={onChange}
    className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm outline-none"
  >
    <option value="" className="text-gray-500">{placeholder}</option>
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
</div>

    )
  }


  export default Select;