import React, { useState, useEffect } from "react";
import VideoLesson from "../components/VideoLesson";
import VisualAid from "../components/VisualAid";
import InteractiveQuiz from "../components/InteractiveQuiz";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import PremiumBanner from "../components/PremiumBanner";
import ProgressTracker from "../components/ProgressTracker";
import { PlayCircle, Image, Award, Star, BookOpen, Video as VideoIcon, Zap, Clock, Search } from "lucide-react";
import axios from "axios";

export default function VisualLearning() {
  const [activeTab, setActiveTab] = useState("video-lessons"); // Tabs for navigation
  const [progress, setProgress] = useState(45); // Example progress value
  const [showPremiumBanner, setShowPremiumBanner] = useState(true); // Control premium banner visibility
  const [videoLessons, setVideoLessons] = useState([]); // State for YouTube videos
  const [loading, setLoading] = useState(true); // Loading state for API call
  const [searchQuery, setSearchQuery] = useState("sign language tutorial"); // Search query state
  const [searchInput, setSearchInput] = useState(""); // User input for search

  // YouTube API Key
  const API_KEY = "AIzaSyCXBvqi3k3WI35dvKKDLGv41ukBmttNHKU"; // Replace with your YouTube API key

  // Fetch YouTube videos based on search query
  const fetchVideos = async (query) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${query}&key=${API_KEY}&type=video`
      );
      const videos = response.data.items.map((item) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url,
        channel: item.snippet.channelTitle,
        duration: "10:00", // Duration can be fetched using another API call
      }));
      setVideoLessons(videos);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching YouTube videos:", error);
      setLoading(false);
    }
  };

  // Fetch videos on component mount
  useEffect(() => {
    fetchVideos(searchQuery);
  }, [searchQuery]);

  // Handle search input submission
  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput); // Update search query state
  };

  // Dummy data for visual aids
  const visualAids = [
    {
      id: 1,
      title: "Sign Language Alphabet Chart",
      image: "/images/alphabet-chart.jpg",
      description: "Learn the basics of sign language alphabets.",
    },
    {
      id: 2,
      title: "Common Phrases Infographic",
      image: "/images/common-phrases.jpg",
      description: "Visual guide to common sign language phrases.",
    },
  ];

  // Dummy data for quizzes
  const quizzes = [
    {
      id: 1,
      title: "Sign Language Basics Quiz",
      questions: 10,
      completed: false,
    },
    {
      id: 2,
      title: "Advanced Sign Language Quiz",
      questions: 15,
      completed: true,
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />
      <Navbar />
      {/* Main Content */}
      <div className="flex-1 ml-64 p-6 mt-20 bg-white">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600">Visual Learning Tools</h1>
          <ProgressTracker progress={progress} />
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex items-center bg-gray-200 rounded-lg p-2">
            <input
              type="text"
              placeholder="Search for videos..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="flex-1 bg-transparent outline-none px-4 py-2"
            />
            <button type="submit" className="p-2 text-gray-600 hover:text-blue-600">
              <Search size={20} />
            </button>
          </div>
        </form>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab("video-lessons")}
            className={`px-6 py-2 rounded-lg flex items-center ${
              activeTab === "video-lessons"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            } hover:bg-blue-600 hover:text-white transition duration-300`}
          >
            <PlayCircle size={18} className="mr-2" />
            Video Lessons
          </button>
          <button
            onClick={() => setActiveTab("visual-aids")}
            className={`px-6 py-2 rounded-lg flex items-center ${
              activeTab === "visual-aids"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            } hover:bg-blue-600 hover:text-white transition duration-300`}
          >
            <Image size={18} className="mr-2" />
            Visual Aids
          </button>
          <button
            onClick={() => setActiveTab("quizzes")}
            className={`px-6 py-2 rounded-lg flex items-center ${
              activeTab === "quizzes"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            } hover:bg-blue-600 hover:text-white transition duration-300`}
          >
            <Award size={18} className="mr-2" />
            Quizzes
          </button>
        </div>

        {/* Content Based on Active Tab */}
        {activeTab === "video-lessons" && (
          <div className="space-y-8">
            {loading ? (
              <div className="text-center text-gray-600">Loading videos...</div>
            ) : (
              videoLessons.map((lesson) => (
                <VideoLesson
                  key={lesson.id}
                  title={lesson.title}
                  duration={lesson.duration}
                  thumbnail={lesson.thumbnail}
                  channel={lesson.channel}
                  videoId={lesson.id}
                />
              ))
            )}
          </div>
        )}

        {activeTab === "visual-aids" && (
          <div className="space-y-8">
            {visualAids.map((aid) => (
              <VisualAid
                key={aid.id}
                title={aid.title}
                image={aid.image}
                description={aid.description}
              />
            ))}
          </div>
        )}

        {activeTab === "quizzes" && (
          <div className="space-y-8">
            {quizzes.map((quiz) => (
              <InteractiveQuiz
                key={quiz.id}
                title={quiz.title}
                questions={quiz.questions}
                completed={quiz.completed}
              />
            ))}
          </div>
        )}

        {/* Premium Banner */}
        {showPremiumBanner && (
          <PremiumBanner onClose={() => setShowPremiumBanner(false)} />
        )}
      </div>
    </div>
  );
}