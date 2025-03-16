import React, { useEffect } from "react";

export default function Poll() {
  useEffect(() => {
    // Dynamically load the Typeform embed script
    const script = document.createElement("script");
    script.src = "//embed.typeform.com/next/embed.js";
    script.async = true;
    document.body.appendChild(script);

    // Cleanup function to remove the script when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold text-blue-600 mb-4">Poll</h3>
      <div
        data-tf-live="01JPF06E03FC25147GYGPWPTQN"
        className="w-full h-[500px] rounded-lg overflow-hidden"
      ></div>
    </div>
  );
}