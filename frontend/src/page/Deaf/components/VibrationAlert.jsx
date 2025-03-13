import React from "react";

export default function VibrationAlert() {
  const handleVibrate = () => {
    if ("vibrate" in navigator) {
      // Vibrate for 500ms
      navigator.vibrate(500);
    } else {
      alert("Vibration is not supported in this browser.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">Vibration Alerts</h2>
      <p className="text-gray-700 mb-4">
        Get notified through vibration alerts for important updates.
      </p>
      <button
        onClick={handleVibrate}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        Test Vibration
      </button>
    </div>
  );
}