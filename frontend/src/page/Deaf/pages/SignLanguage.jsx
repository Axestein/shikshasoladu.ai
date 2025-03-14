// SignLanguage.jsx
import React from 'react';
import VideoPlayer from "../components/VideoPlayer";
import SignLanguageTranslator from "../components/SignLanguageTranslator";
import SignLanguageDictionary from "../components/SignLanguageDictionary";
import SignLangDetection from "../components/SignLangDetection";
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const SignLanguage = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />
      <Navbar />
      {/* Main Content */}
      <div className="flex-1 ml-64 p-6 mt-20 bg-white">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Sign Language Integration
        </h2>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <VideoPlayer />
          <SignLanguageTranslator />
        </div>

        {/* Additional Sections */}
        <div className="mt-6">
          <SignLanguageDictionary />
        </div>

        <div className="mt-6">
          <SignLangDetection />
        </div>
      </div>
    </div>
  );
}

export default SignLanguage;
