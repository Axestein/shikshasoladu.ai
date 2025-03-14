// Accessibility.jsx
import React from "react";
import VibrationAlert from "../components/VibrationAlert";
import VisualFeedback from "../components/VisualFeedback";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function Accessibility() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />
      <Navbar />
      {/* Main Content */}
      <div className="flex-1 ml-64 p-6 mt-20 bg-white">
        <h1 className="text-4xl font-bold text-blue-600 mb-8">Accessibility Tools</h1>
        
        {/* Content */}
        <div className="space-y-8">
          <VibrationAlert />
          <VisualFeedback />
        </div>
      </div>
    </div>
  );
}
