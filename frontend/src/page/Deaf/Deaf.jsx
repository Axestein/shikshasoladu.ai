// Home.jsx
import React from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />
      <Navbar />
      {/* Main Content */}
      <div className="flex-1 ml-64 p-6 mt-20 bg-white">  {/* Added ml-64 to prevent overlap */}
        <div className="text-center py-20">
          <h1 className="text-5xl font-bold text-blue-600 mb-4">
            Welcome to DeafEdTech
          </h1>
          <p className="text-xl text-gray-700">
            Empowering the Deaf Community through Visual Learning and Sign Language Support
          </p>
          <div className="mt-8">
            <a
              href="/features"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Explore Features
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
