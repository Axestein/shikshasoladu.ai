import React from "react";

export default function ProgressTracker({ progress }) {
  return (
    <div className="flex items-center space-x-4">
      <div className="w-32 h-2 bg-gray-200 rounded-full">
        <div
          className="h-full bg-blue-600 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <span className="text-gray-700">{progress}% Completed</span>
    </div>
  );
}