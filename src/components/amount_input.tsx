import React, { useState } from "react";

type AmountInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function AmountInput({ value, onChange }: AmountInputProps) {
  // Function to format the amount with comma separator for display
  const formatValue = (input: string) => {
    // Remove all non-digit characters
    const cleanInput = input.replace(/\D/g, "");

    // Add comma separator every 3 digits
    return cleanInput.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatValue(e.target.value);
    onChange(formattedValue);
  };

  return (
    <div className="relative w-full" dir="ltr">
      <input
        type="text"
        className="w-full h-[62px] rounded-[10px] border-[#D6D6D6] border-2 text-end pr-4 pl-[60px]"
        placeholder="0"
        inputMode="numeric"
        // pattern="\d*"
        required
        value={formatValue(value)}
        onChange={handleChange}
      />
      <span className="absolute inset-y-0 left-4 flex items-center text-gray-600">
        تومان
      </span>
    </div>
  );
}
