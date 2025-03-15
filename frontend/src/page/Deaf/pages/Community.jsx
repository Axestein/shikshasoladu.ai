import React, { useState, useEffect } from "react";
import Forum from "../components/Forum";
import LiveChat from "../components/LiveChat";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Poll from "../components/Poll";
import SignLanguageVideo from "../components/SignLanguageVideo";
import VisualNotification from "../components/VisualNotification";
import { Video, Users, MessageCircle, Bell, ThumbsUp, Camera, Mic, Smile, FileText, ArrowRight } from "lucide-react";

export default function Community() {
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("forum"); // Tabs for navigation
  const [pollResults, setPollResults] = useState({});
  const [isSignLanguageOpen, setIsSignLanguageOpen] = useState(false);

  // Dummy data for notifications
  useEffect(() => {
    setNotifications([
      { id: 1, message: "New message from John", type: "message", read: false },
      { id: 2, message: "Your post got 10 likes", type: "like", read: false },
      { id: 3, message: "New poll created: Best Sign Language App", type: "poll", read: false },
    ]);
  }, []);

  // Handle poll submission
  const handlePollSubmit = (pollId, selectedOption) => {
    setPollResults((prev) => ({
      ...prev,
      [pollId]: selectedOption,
    }));
  };

  // Mark notification as read
  const markNotificationAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />
      <Navbar />
      {/* Main Content */}
      <div className="flex-1 ml-64 p-6 mt-20 bg-white">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600">Community Features</h1>
          <button
            onClick={() => setIsSignLanguageOpen(!isSignLanguageOpen)}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            <Camera size={20} className="mr-2" />
            {isSignLanguageOpen ? "Close Sign Language" : "Open Sign Language"}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab("forum")}
            className={`px-6 py-2 rounded-lg ${
              activeTab === "forum"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            } hover:bg-blue-600 hover:text-white transition duration-300`}
          >
            <MessageCircle size={18} className="inline-block mr-2" />
            Forum
          </button>
          <button
            onClick={() => setActiveTab("chat")}
            className={`px-6 py-2 rounded-lg ${
              activeTab === "chat"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            } hover:bg-blue-600 hover:text-white transition duration-300`}
          >
            <Users size={18} className="inline-block mr-2" />
            Live Chat
          </button>
          <button
            onClick={() => setActiveTab("polls")}
            className={`px-6 py-2 rounded-lg ${
              activeTab === "polls"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            } hover:bg-blue-600 hover:text-white transition duration-300`}
          >
            <ThumbsUp size={18} className="inline-block mr-2" />
            Polls
          </button>
        </div>

        {/* Content Based on Active Tab */}
        {activeTab === "forum" && (
          <div className="space-y-8">
            <Forum />
          </div>
        )}

        {activeTab === "chat" && (
          <div className="space-y-8">
            <LiveChat />
          </div>
        )}

        {activeTab === "polls" && (
          <div className="space-y-8">
            <Poll
              question="What is your favorite sign language app?"
              options={["Signily", "HandTalk", "SignAll", "Other"]}
              onSubmit={handlePollSubmit}
            />
            {pollResults["poll1"] && (
              <div className="mt-4">
                <h3 className="text-xl font-bold text-blue-600 mb-2">Poll Results</h3>
                <p>You selected: {pollResults["poll1"]}</p>
              </div>
            )}
          </div>
        )}

        {/* Sign Language Video Modal */}
        {isSignLanguageOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-11/12 max-w-4xl">
              <h2 className="text-2xl font-bold text-blue-600 mb-4">
                Sign Language Support
              </h2>
              <SignLanguageVideo />
              <button
                onClick={() => setIsSignLanguageOpen(false)}
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Visual Notifications */}
        <div className="fixed bottom-4 right-4 space-y-2">
          {notifications.map((notification) => (
            <VisualNotification
              key={notification.id}
              message={notification.message}
              type={notification.type}
              read={notification.read}
              onDismiss={() => markNotificationAsRead(notification.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}