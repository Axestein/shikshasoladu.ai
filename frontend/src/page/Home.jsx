import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Ear, Eye, Users, Book, Video, Award, Globe, ArrowRight, HandMetal, Braces } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.log("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      console.log("You said:", transcript);

      if (transcript.includes("take me to the blind page")) {
        navigate("/blind");
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    return () => {
      recognition.stop();
    };
  }, [navigate]);

  const CustomNavbar = () => (
    <nav className="w-full bg-indigo-700 p-4 shadow-lg fixed top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold flex items-center gap-2">
          <span className="text-yellow-300">Shiksha</span>Soladu.ai
        </Link>

        <ul className="hidden md:flex space-x-6">
          <li>
            <Link to="/" className="text-white hover:text-yellow-300 flex items-center gap-1 transition duration-300">
              <Globe size={18} />
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link to="/about" className="text-white hover:text-yellow-300 flex items-center gap-1 transition duration-300">
              <Book size={18} />
              <span>About Us</span>
            </Link>
          </li>
          <li>
            <Link to="/courses" className="text-white hover:text-yellow-300 flex items-center gap-1 transition duration-300">
              <Video size={18} />
              <span>Courses</span>
            </Link>
          </li>
          <li>
            <Link to="/community" className="text-white hover:text-yellow-300 flex items-center gap-1 transition duration-300">
              <Users size={18} />
              <span>Community</span>
            </Link>
          </li>
          <li>
            <Link to="/login" className="bg-yellow-400 text-indigo-800 px-4 py-2 rounded-md hover:bg-yellow-300 transition duration-300 font-medium">
              Sign In
            </Link>
          </li>
        </ul>

        <button className="md:hidden text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-indigo-50">
      <CustomNavbar />

      {/* Hero Section */}
      <div className="pt-24 pb-16 px-4 md:pt-28 md:pb-24">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-indigo-800 mb-6 leading-tight">
            Inclusive Learning for <span className="text-yellow-500">Everyone</span>
          </h1>
          <p className="text-xl text-gray-700 mb-10 max-w-3xl mx-auto">
            Personalized education technology designed for deaf and blind learners, making quality education accessible to all.
          </p>

          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {/* Deaf Community Card */}
              <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all overflow-hidden group">
                <div className="bg-indigo-600 h-2 w-full"></div>
                <div className="p-6">
                  <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                    <Ear size={32} className="text-indigo-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-indigo-800 mb-4">Deaf Community</h2>
                  <p className="text-gray-600 mb-6">
                    Visual learning tools, sign language integration, and captions to make learning accessible and engaging.
                  </p>
                  <ul className="text-left text-gray-600 mb-8 space-y-2">
                    <li className="flex items-center">
                      <span className="bg-green-100 p-1 rounded-full mr-2">
                        <Video size={14} className="text-green-600" />
                      </span>
                      Sign language video lessons
                    </li>
                    <li className="flex items-center">
                      <span className="bg-green-100 p-1 rounded-full mr-2">
                        <HandMetal size={14} className="text-green-600" />
                      </span>
                      Interactive signing practice
                    </li>
                    <li className="flex items-center">
                      <span className="bg-green-100 p-1 rounded-full mr-2">
                        <Users size={14} className="text-green-600" />
                      </span>
                      Deaf community support
                    </li>
                  </ul>
                  <Link
                    to="/deaf"
                    className="block w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 transition duration-300 text-center group-hover:bg-indigo-500"
                  >
                    <span className="flex items-center justify-center">
                      Explore Deaf Learning
                      <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                </div>
              </div>

              {/* Blind Community Card */}
              <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all overflow-hidden group">
                <div className="bg-purple-600 h-2 w-full"></div>
                <div className="p-6">
                  <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                    <Eye size={32} className="text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-purple-800 mb-4">Blind Community</h2>
                  <p className="text-gray-600 mb-6">
                    Screen reader optimized content, audio descriptions, and tactile learning experiences.
                  </p>
                  <ul className="text-left text-gray-600 mb-8 space-y-2">
                    <li className="flex items-center">
                      <span className="bg-green-100 p-1 rounded-full mr-2">
                        <Book size={14} className="text-green-600" />
                      </span>
                      Audio textbooks & lessons
                    </li>
                    <li className="flex items-center">
                      <span className="bg-green-100 p-1 rounded-full mr-2">
                        <Braces size={14} className="text-green-600" />
                      </span>
                      Screen reader optimized
                    </li>
                    <li className="flex items-center">
                      <span className="bg-green-100 p-1 rounded-full mr-2">
                        <Award size={14} className="text-green-600" />
                      </span>
                      Audio-based assessments
                    </li>
                  </ul>
                  <Link
                    to="/blind"
                    className="block w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 transition duration-300 text-center group-hover:bg-purple-500"
                  >
                    <span className="flex items-center justify-center">
                      Explore Blind Learning
                      <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                </div>
              </div>

              {/* All Users Card */}
              <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all overflow-hidden group">
                <div className="bg-teal-600 h-2 w-full"></div>
                <div className="p-6">
                  <div className="bg-teal-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                    <Users size={32} className="text-teal-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-teal-800 mb-4">Universal Access</h2>
                  <p className="text-gray-600 mb-6">
                    Fully inclusive platform with adaptive content that works for everyone regardless of ability.
                  </p>
                  <ul className="text-left text-gray-600 mb-8 space-y-2">
                    <li className="flex items-center">
                      <span className="bg-green-100 p-1 rounded-full mr-2">
                        <Globe size={14} className="text-green-600" />
                      </span>
                      Adaptive learning paths
                    </li>
                    <li className="flex items-center">
                      <span className="bg-green-100 p-1 rounded-full mr-2">
                        <Video size={14} className="text-green-600" />
                      </span>
                      Multi-format content
                    </li>
                    <li className="flex items-center">
                      <span className="bg-green-100 p-1 rounded-full mr-2">
                        <Users size={14} className="text-green-600" />
                      </span>
                      Collaborative activities
                    </li>
                  </ul>
                  <Link
                    to="/allusers"
                    className="block w-full bg-teal-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-teal-700 transition duration-300 text-center group-hover:bg-teal-500"
                  >
                    <span className="flex items-center justify-center">
                      Explore Universal Access
                      <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
