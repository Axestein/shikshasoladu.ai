import React from "react";
import VibrationAlert from "../components/VibrationAlert";
import VisualFeedback from "../components/VisualFeedback";
import Navbar from "../components/Navbar";

export default function Accessibility() {
  return (
    <div>
    <Navbar />
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-blue-600 mb-8">Accessibility Tools</h1>
      <div className="space-y-8">
        <VibrationAlert />
        <VisualFeedback />
      </div>
    </div>
    </div>
  );
}