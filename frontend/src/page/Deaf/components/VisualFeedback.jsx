import React, { useState } from "react";

export default function VisualFeedback() {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 300); // Reset after 300ms
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">
        Visual Feedback for Interactions
      </h2>
      <p className="text-gray-700 mb-4">
        Receive visual feedback for button clicks and other interactions.
      </p>
      <button
        onClick={handleClick}
        className={`px-4 py-2 rounded-lg transition-all ${
          isClicked
            ? "bg-green-600 text-white scale-105"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        Click Me
      </button>
    </div>
  );
}