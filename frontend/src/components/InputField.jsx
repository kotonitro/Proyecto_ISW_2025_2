import React from "react";

export default function InputField({
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  name,
  id,
  disabled,
}) {
  return (
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
    />
  );
}
