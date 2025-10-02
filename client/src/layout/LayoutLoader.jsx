import React from "react";

const Loader = () => {
  const n1 = "Mart";
  const n2 = "Com";

  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <h1 className="text-[#fcb800]">{n1}</h1>
      <h1 className="text-black">{n2}</h1>
    </div>
  );
};

export default Loader;
