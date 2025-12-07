// src/components/common/Loader.tsx
import React from "react";

const Loader: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="p-4 bg-gray-100 rounded shadow text-center text-gray-600 animate-pulse">
      {message}
    </div>
  );
};

export default Loader;
