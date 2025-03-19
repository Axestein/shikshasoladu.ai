import React, { useEffect } from 'react';
import {useNavigate, Link} from 'react-router-dom';
import { motion } from 'framer-motion';
import blind from '../page/Deaf/assets/blind.jpg';
import deaf from '../page/Deaf/assets/deaf.jpg';
import wheel from '../page/Deaf/assets/wheel.jpg';
import alarmy from '../page/Deaf/assets/alarmy.jpg';
import blindboy from "../page/Deaf/assets/blindboy.jpg";
import { Ear, Eye, Users, Book, Video, Award, Globe, ArrowRight, HandMetal, Braces } from "lucide-react";


const MentorshipLandingPage = () => {
  const navigate = useNavigate();

  const CustomNavbar = () => (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.1 }}
      className="w-full bg-indigo-700 p-2 shadow-lg fixed top-0 ml-0 z-10"
    >
      <div className="container mx-auto flex justify-between items-center mr-60">
        <Link to="/" className="text-white text-2xl font-bold flex items-center ml-20 gap-2">
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
    </motion.nav>
  );

  useEffect(() => {
    // Check if the browser supports the Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.log("Speech recognition not supported in this browser.");
      return;
    }

    // Initialize speech recognition
    const recognition = new SpeechRecognition();
    recognition.continuous = false; // Stop after one command
    recognition.interimResults = false; // Only final results
    recognition.lang = "en-US"; // Set language

    // Start listening
    recognition.start();

    // Event handler for when speech is recognized
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      console.log("You said:", transcript);

      // Check for the specific command
      if (transcript.includes("take me to the blind page")) {
        navigate("/blind"); // Navigate to the blind page
      }
    };

    // Handle errors
    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    // Cleanup on component unmount
    return () => {
      recognition.stop();
    };
  }, [navigate]);

  useEffect(() => {
    // Animation logic can be added here if needed
  }, []);


  return (
    <div className="flex justify-center items-center min-h-screen bg-yellow-300 p-10">
      
      <CustomNavbar />
      {/* Style to hide scrollbar */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>

      {/* Yellow border container - fixed size with scrollable content */}
      <div className="w-[4500px]  bg-yellow-300 p-4 rounded-2xl h-[90vh] flex flex-col">
        
        {/* Main content with white background - scrollable with hidden scrollbar */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-xl p-6 relative overflow-y-auto flex-grow scrollbar-hide"
        >
          {/* Navigation */}
          {/* Hero Section */}
          <div className="flex pt-24">
            {/* Left content */}
            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="w-1/2 pr-8"
            >
              <div className="relative mb-6">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="w-16 h-16 bg-orange-500 rounded-full"
                />
              </div>
              
              <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-5xl font-bold leading-tight mb-6"
              >
                Inclusive Learning for Everyone.
              </motion.h1>
              
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-gray-600 mb-8"
              >
                Personalized education technology designed for deaf and blind learners, making quality education accessible to all.
              </motion.p>
              
              <div className="flex space-x-4 mb-12">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="flex items-center px-8 py-3 bg-blue-500 text-white rounded-full"
                >
                  Need Help?
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </motion.button>
                
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="flex items-center px-8 py-3 bg-yellow-400 text-black rounded-full"
                >
                  Search
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </motion.button>
              </div>
              
              
            </motion.div>
            
            {/* Right side illustrations */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="w-1/2 relative"
            >
              {/* Illustrations placeholder with animations */}
              <motion.div 
                animate={{ 
                  y: [0, -15, 0],
                  transition: { duration: 3, repeat: Infinity, repeatType: "reverse" }
                }}
                className="absolute top-0 left-0 w-40 h-40 border-2 border-gray-200 rounded-tl-full rounded-tr-full rounded-br-full bg-white flex items-center justify-center"
              >
                <div className="w-32 h-32 flex items-center justify-center">
                  <img src={blind} alt="Person with smartphone" className="max-w-full" />
                </div>
              </motion.div>
              
              <motion.div 
                animate={{ 
                  y: [0, 15, 0],
                  transition: { duration: 4, repeat: Infinity, repeatType: "reverse" }
                }}
                className="absolute top-0 right-0 w-32 h-32 border-2 border-gray-200 rounded-tl-full rounded-tr-full rounded-bl-full bg-white flex items-center justify-center"
              >
                <div className="w-24 h-24 flex items-center justify-center">
                  <img src={blind} alt="Person with object" className="max-w-full" />
                </div>
              </motion.div>
              
              <motion.div 
                animate={{ 
                  x: [0, 10, 0],
                  transition: { duration: 5, repeat: Infinity, repeatType: "reverse" }
                }}
                className="absolute top-32 left-24 w-32 h-32 border-2 border-gray-200 rounded-tl-full rounded-tr-full rounded-bl-full bg-white flex items-center justify-center"
              >
                <div className="w-24 h-24 flex items-center justify-center">
                  <img src={deaf} alt="Person with curly hair" className="max-w-full" />
                </div>
              </motion.div>
              
              <motion.div 
                animate={{ 
                  scale: [1, 1.05, 1],
                  transition: { duration: 4, repeat: Infinity, repeatType: "reverse" }
                }}
                className="absolute top-32 right-12 w-40 h-40 border-2 border-gray-200 rounded-tl-full rounded-tr-full rounded-bl-full flex items-center justify-center"
              >
                <div className="w-32 h-32 flex items-center justify-center">
                  <img src={blindboy} alt="Person with helmet" className="max-w-full" />
                </div>
              </motion.div>
              
              <motion.div 
                animate={{ 
                  rotate: [0, 45, 0],
                  transition: { duration: 8, repeat: Infinity, repeatType: "reverse" }
                }}
                className="absolute top-40 left-0 w-10 h-10 bg-blue-200 rounded-sm"
              />
              
              <motion.div 
                animate={{ 
                  scale: [1, 1.2, 1],
                  transition: { duration: 3, repeat: Infinity, repeatType: "reverse" }
                }}
                className="absolute top-12 right-12 w-6 h-6 bg-yellow-400 rounded-full"
              />
              
              <motion.div 
                animate={{ 
                  y: [0, -10, 0],
                  transition: { duration: 5, repeat: Infinity, repeatType: "reverse" }
                }}
                className="absolute bottom-0 left-12 w-48 h-48 border-2 border-gray-200 rounded-tl-full rounded-tr-full rounded-bl-full bg-white flex items-center justify-center"
              >
                <div className="w-40 h-40 flex items-center justify-center">
                  <img src={wheel} alt="Person looking at screen" className="max-w-full" />
                </div>
              </motion.div>
              
              <motion.div 
                animate={{ 
                  y: [0, 10, 0],
                  transition: { duration: 4, repeat: Infinity, repeatType: "reverse" }
                }}
                className="absolute bottom-0 right-0 w-48 h-48 border-2 border-gray-200 rounded-full bg-white flex items-center justify-center"
              >
                <div className="w-40 h-40 rounded-full overflow-hidden flex items-center justify-center">
                    <img
                      src={alarmy}  // Replace with your actual image URL
                      alt="Person holding object"
                      className="w-full h-full object-cover"
                    />
                </div>
              </motion.div>
            </motion.div>
          </div>
          

           {/* Cards Section */}
          <div className="max-w-5xl mx-auto mt-16">
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
                    to="/authdeaf"
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
          
          {/* Find Mentor Section */}
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="bg-gray-50 rounded-xl p-8 mt-16"
          >
            <h2 className="text-2xl font-bold mb-4">Find Your Right Mentor</h2>
            <p className="text-gray-600 mb-8">Stay connected with a monthly or yearly subscription.</p>
            
            <div className="flex space-x-6">
              {/* Left illustration */}
              <div className="w-1/3 bg-white rounded-xl p-6 relative">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="absolute top-6 right-6 bg-white rounded-md px-3 py-1 shadow-md flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs font-medium">Available Solutions</span>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="absolute top-20 left-0 bg-white rounded-e-md px-3 py-1 shadow-md"
                >
                  <div className="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm8 8v2h1v-2h-1zm-2-6V5h1v2h-1zm2 0h1v4h-1V7zm1 6h-1v2H7v-2h6v2zm-8-2v2H5v-2h3zm-4-4h3v4H5V7zm0-2v2H4V5h1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs font-medium">Easy Methods</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Available help even through video calls</p>
                </motion.div>
                
                <motion.div 
                  animate={{ 
                    y: [0, -5, 0],
                    transition: { duration: 3, repeat: Infinity, repeatType: "reverse" }
                  }}
                  className="mt-32 flex flex-col items-center"
                >
                  <img src="/api/placeholder/180/180" alt="User profile" className="w-full max-h-48 object-contain" />
                  
                  <div className="bg-white rounded-lg shadow-lg p-4 relative mt-4 w-full">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="bg-blue-500 rounded-md w-8 h-8 flex items-center justify-center mr-3">
                          <span className="text-white text-xs font-bold">PS</span>
                        </div>
                        <div>
                          <p className="font-medium">Perry Snow</p>
                          <p className="text-xs text-gray-500">UX Trainer</p>
                        </div>
                      </div>
                      
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </div>
              
              {/* Right side info boxes */}
              <div className="w-2/3 space-y-6">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  animate={{ 
                    x: [0, 5, 0],
                    transition: { duration: 6, repeat: Infinity, repeatType: "reverse" }
                  }}
                  className="bg-white rounded-xl p-6 flex items-center"
                >
                  <div className="bg-yellow-100 rounded-xl p-4 mr-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Ring or message your mentor anytime</h3>
                    <p className="text-gray-600">We have the right mentors for any job, we will find you the right mentor and help you to connect with them easily.</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  animate={{ 
                    x: [0, -5, 0],
                    transition: { duration: 5, repeat: Infinity, repeatType: "reverse" }
                  }}
                  className="bg-white rounded-xl p-6 flex items-center"
                >
                  <div className="bg-yellow-100 rounded-xl p-4 mr-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Become a mentor and help out people</h3>
                    <p className="text-gray-600">We have the right mentors for any job, we will find you the right mentor and help you to connect with them easily.</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default MentorshipLandingPage;