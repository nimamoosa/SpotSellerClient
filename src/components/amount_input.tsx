import React from "react";

type AmountInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function AmountInput({
  value,
  onChange,
  placeholder,
}: AmountInputProps) {
  // Function to remove all non-digit characters
  const removeFormatting = (input: string) => input.replace(/\D/g, "");

  // Function to format the amount with comma separator for display
  const formatValue = (input: string) => {
    const cleanInput = removeFormatting(input);
    return cleanInput.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Remove formatting for saving raw value
    const cleanValue = removeFormatting(inputValue);

    // Prevent leading zero
    if (cleanValue.startsWith("0") && cleanValue.length >= 1) {
      return; // Prevent updating state if input starts with leading zero
    }

    // Pass clean value (without commas) to onChange
    onChange(cleanValue);
  };

  return (
    <div className="relative w-full" dir="ltr">
      <input
        type="text"
        className="w-full h-[62px] rounded-[10px] border-[#D6D6D6] border-2 text-end pr-4 pl-[60px]"
        placeholder={placeholder || "0"}
        inputMode="numeric"
        required
        // Format value with commas for display only
        value={formatValue(value)}
        onChange={handleChange}
      />
      <span className="absolute inset-y-0 left-4 flex items-center text-gray-600">
        تومان
      </span>
    </div>
  );
}
