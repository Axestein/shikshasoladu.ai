import React from "react";
import { Bell, MessageCircle, ThumbsUp } from "lucide-react";

export default function VisualNotification({ message, type, read, onDismiss }) {
  const icon = {
    message: <MessageCircle size={20} className="text-blue-600" />,
    like: <ThumbsUp size={20} className="text-green-600" />,
    poll: <Bell size={20} className="text-purple-600" />,
  }[type];

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-4">
      <div className="flex-shrink-0">{icon}</div>
      <div className="flex-1">
        <p className="text-gray-700">{message}</p>
      </div>
      <button
        onClick={onDismiss}
        className="text-gray-500 hover:text-gray-700 transition duration-300"
      >
        &times;
      </button>
    </div>
  );
}