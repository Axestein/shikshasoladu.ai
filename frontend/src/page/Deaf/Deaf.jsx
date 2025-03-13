import React from "react";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-6">
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