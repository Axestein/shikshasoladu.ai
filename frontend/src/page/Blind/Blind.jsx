import React, { useEffect } from "react";

export default function Blind() {
  // Function to speak a message
  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = 1; // Volume (0 to 1)
    utterance.rate = 1; // Speed (0.1 to 10)
    utterance.pitch = 1; // Pitch (0 to 2)
    window.speechSynthesis.speak(utterance);
  };

  // Speak the welcome message when the component mounts
  useEffect(() => {
    speak("Welcome to the blind page. Here you can access audio lessons, screen reader support, and Braille resources.");
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-purple-600 mb-4">
        Blind Community Platform
      </h1>
      <p className="text-lg text-gray-700">
        Audio lessons, screen reader support, and Braille resources.
      </p>
    </div>
  );
}