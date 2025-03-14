// Community.jsx
import React from "react";
import Forum from "../components/Forum";
import LiveChat from "../components/LiveChat";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function Community() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />
      <Navbar />
      {/* Main Content */}
      <div className="flex-1 ml-64 p-6 mt-20 bg-white">
        <h1 className="text-4xl font-bold text-blue-600 mb-8">Community Features</h1>
        
        {/* Content */}
        <div className="space-y-8">
          <Forum />
          <LiveChat />
        </div>
      </div>
    </div>
  );
}
