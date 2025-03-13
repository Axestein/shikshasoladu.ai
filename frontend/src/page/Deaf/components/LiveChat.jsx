import React, { useState, useEffect } from "react";

export default function LiveChat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // Simulate fetching chat messages
    const data = JSON.parse(localStorage.getItem("chatMessages")) || [];
    setMessages(data);
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    const updatedMessages = [
      ...messages,
      { id: Date.now(), content: newMessage },
    ];
    setMessages(updatedMessages);
    localStorage.setItem("chatMessages", JSON.stringify(updatedMessages));
    setNewMessage("");
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">
        Live Chat with Sign Language Support
      </h2>
      <div className="space-y-4">
        <div className="h-64 overflow-y-auto border border-gray-200 rounded-lg p-4">
          {messages.map((message) => (
            <div key={message.id} className="mb-2">
              <p className="text-gray-700">{message.content}</p>
            </div>
          ))}
        </div>
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Send
          </button>
        </div>
        <p className="text-gray-700 text-sm">
          Note: Sign language support will be integrated here.
        </p>
      </div>
    </div>
  );
}