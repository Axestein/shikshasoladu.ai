// Home.jsx
import React from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        
        <main className="flex-1 overflow-y-auto p-6 ml-60">
          <div className="flex flex-col items-center justify-center h-full text-center max-w-4xl mx-auto">
            <div className="mb-10">
              <h1 className="text-4xl font-bold text-blue-600 mb-4">Welcome to ShikshaSoladu.ai Deaf Edtech Page</h1>
              <p className="text-xl text-gray-700 mb-8">
                Empowering the Deaf Community through Visual Learning and Sign Language Support
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-500">
                  <div className="text-blue-500 text-4xl mb-4">👁️</div>
                  <h3 className="text-lg font-semibold mb-2">Visual Learning</h3>
                  <p className="text-gray-600">Interactive visual content designed for maximum accessibility</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-500">
                  <div className="text-green-500 text-4xl mb-4">🤲</div>
                  <h3 className="text-lg font-semibold mb-2">Sign Language</h3>
                  <p className="text-gray-600">Comprehensive sign language resources and translation tools</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-purple-500">
                  <div className="text-purple-500 text-4xl mb-4">👥</div>
                  <h3 className="text-lg font-semibold mb-2">Community</h3>
                  <p className="text-gray-600">Connect with peers, educators, and mentors in the deaf community</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}