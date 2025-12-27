import React from "react";

export default function PageHeader({ title }) {
  return (
    <h1 className="text-3xl font-bold text-gray-800 border-l-4 border-blue-600 pl-4">
    {title}
    </h1>
  );
}