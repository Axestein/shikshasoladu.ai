import React from "react";
import Forum from "../components/Forum";
import LiveChat from "../components/LiveChat";
import Navbar from "../components/Navbar";

export default function Community() {
  return (
    <div>
    <Navbar />
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-blue-600 mb-8">Community Features</h1>
      <div className="space-y-8">
        <Forum />
        <LiveChat />
      </div>
    </div>
    </div>
  );
}