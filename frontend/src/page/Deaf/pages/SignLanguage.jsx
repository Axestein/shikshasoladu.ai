import React, { useEffect } from 'react';
import SignLanguageDictionary from "../components/SignLanguageDictionary";
import SignLangDetection from "../components/SignLangDetection";
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const SignLanguage = () => { 
  // Add subtle fade-in animation when component mounts
  useEffect(() => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.classList.add('opacity-100');
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <Sidebar />
      <Navbar />
      
      {/* Main Content with subtle animation */}
      <div 
        id="main-content"
        className="flex-1 ml-64 p-8 mt-20 bg-white rounded-tl-3xl shadow-sm transition-opacity duration-500 opacity-0"
      >
        <div className="max-w-6xl mx-auto ">
          {/* Hero Section */}
          <div className="relative mb-12 border border-blue-50 "> 
            <div className="absolute inset-0 bg-blue-400 rounded-2xl transform -rotate-1"></div>
            <div className="relative bg-white rounded-2xl p-8 shadow-sm border border-blue-400">
              <h2 className="text-4xl font-bold text-gray-800 mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                Sign Language Integration
              </h2>
              <p className="text-gray-600 max-w-2xl">
                Explore our comprehensive sign language tools designed to break communication barriers.
              </p>
            </div>
          </div>

          {/* Content Sections with Cards */}
          <div className="grid gap-8">
            {/* Dictionary Section */}
            <div className="transform transition-all duration-300 hover:translate-y-1 hover:shadow-lg">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-400">
                <SignLanguageDictionary />
              </div>
            </div>

            {/* Detection Section */}
            <div className="transform transition-all duration-300 hover:translate-y-1 hover:shadow-lg shadow shadow-blue-400">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-400">
                <SignLangDetection />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignLanguage;