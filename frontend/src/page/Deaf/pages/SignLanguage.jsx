import React from 'react'
import VideoPlayer from "../components/VideoPlayer";
import SignLanguageTranslator from "../components/SignLanguageTranslator";
import SignLanguageDictionary from "../components/SignLanguageDictionary";
import SignLangDetection from "../components/SignLangDetection";
import Navbar from "../components/Navbar";

const SignLanguage = () => {
  return (
    <div>
        <section className="mb-12">
            
                  <Navbar />
                  <h2 className="text-3xl font-semibold text-gray-800 mb-4">
                    Sign Language Integration
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <VideoPlayer />
                    <SignLanguageTranslator />
                  </div>
                  <div className="mt-6">
                    <SignLanguageDictionary />
                  </div>
                  <div className="mt-6">
                    <SignLangDetection />
                  </div>
                </section>
        
    </div>
  )
}

export default SignLanguage