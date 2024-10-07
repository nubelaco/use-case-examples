import React from "react";

const Loader = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-600"></div>
      <div className="text-2xl font-bold mt-6">Loading...</div>
    </div>
  );
};

export default Loader;
