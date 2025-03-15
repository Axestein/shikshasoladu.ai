import React from "react";
import { User, Settings, Award, BookOpen, Video, BarChart, Calendar, Bell, HandMetal } from "lucide-react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const DProfile = () => {
  // Dummy data for user profile
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    profilePicture: "/images/profile-picture.jpg",
    signLanguageLevel: "Intermediate",
    completedCourses: 12,
    achievements: 5,
    upcomingEvents: [
      { id: 1, title: "Sign Language Workshop", date: "2023-11-15" },
      { id: 2, title: "Deaf Community Meetup", date: "2023-11-20" },
    ],
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />
      <Navbar />
      {/* Main Content */}
      <div className="flex-1 ml-64 p-6 mt-20">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">Profile</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center">
            <Settings size={18} className="mr-2" />
            Edit Profile
          </button>
        </div>

        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center space-x-6">
            <img
              src={user.profilePicture}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover"
            />
            <div>
              <h2 className="text-2xl font-bold text-blue-600">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
              <div className="flex items-center space-x-2 mt-2">
                <HandMetal size={18} className="text-yellow-500" />
                <span className="text-gray-700">{user.signLanguageLevel} Sign Language</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6 flex items-center space-x-4">
            <BookOpen size={24} className="text-blue-600" />
            <div>
              <h3 className="text-xl font-bold text-blue-600">{user.completedCourses}</h3>
              <p className="text-gray-600">Completed Courses</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 flex items-center space-x-4">
            <Award size={24} className="text-purple-600" />
            <div>
              <h3 className="text-xl font-bold text-purple-600">{user.achievements}</h3>
              <p className="text-gray-600">Achievements</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 flex items-center space-x-4">
            <Video size={24} className="text-green-600" />
            <div>
              <h3 className="text-xl font-bold text-green-600">12+</h3>
              <p className="text-gray-600">Video Lessons</p>
            </div>
          </div>
        </div>

        {/* Upcoming Events Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-blue-600 mb-6">Upcoming Events</h2>
          <div className="space-y-4">
            {user.upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="text-lg font-bold text-blue-600">{event.title}</h3>
                  <p className="text-gray-600">{event.date}</p>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300">
                  <Calendar size={18} className="mr-2" />
                  Add to Calendar
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Section */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-blue-600 mb-6">Your Progress</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-blue-600">Sign Language Basics</h3>
              <div className="w-1/2 bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: "75%" }}></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-blue-600">Advanced Sign Language</h3>
              <div className="w-1/2 bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: "50%" }}></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-blue-600">Everyday Conversations</h3>
              <div className="w-1/2 bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: "90%" }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DProfile;