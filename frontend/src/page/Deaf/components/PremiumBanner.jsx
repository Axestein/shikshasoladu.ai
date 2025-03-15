import React from "react";
import { Zap, X } from "lucide-react";

export default function PremiumBanner({ onClose }) {
  return (
    <div className="fixed bottom-4 right-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg shadow-lg max-w-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold flex items-center">
          <Zap size={20} className="mr-2" />
          Unlock Premium Features
        </h2>
        <button onClick={onClose} className="text-white hover:text-gray-200">
          <X size={20} />
        </button>
      </div>
      <p className="text-sm mb-4">
        Get access to exclusive content, ad-free experience, and advanced learning tools.
      </p>
      <button className="w-full bg-white text-blue-600 px-4 py-2 rounded-lg font-bold hover:bg-gray-100 transition duration-300">
        Upgrade Now
      </button>
    </div>
  );
}