import React from "react";
import VideoLesson from "../components/VideoLesson";
import VisualAid from "../components/VisualAid";
import InteractiveQuiz from "../components/InteractiveQuiz";
import Navbar from "../components/Navbar";

export default function VisualLearning() {
  return (
    <div>
    <Navbar />
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-blue-600 mb-8">
        Visual Learning Tools
      </h1>
      <div className="space-y-8">
        <VideoLesson />
        <VisualAid />
        <InteractiveQuiz />
      </div>
    </div>
    </div>
  );
}