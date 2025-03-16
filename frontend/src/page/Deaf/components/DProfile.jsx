import React from "react";
import { User, Settings, Award, BookOpen, Video, BarChart, Calendar, Bell, HandMetal, Medal, Zap, Users, Clock, Heart } from "lucide-react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import mira from "../assets/mira.jpg";

const DProfile = () => {
  // Enhanced user data
  const user = {
    name: "Mira Jones",
    email: "mirajones@gmail.com",
    profilePicture: mira,
    signLanguageLevel: "Intermediate",
    completedCourses: 12,
    achievements: 5,
    streak: 28,
    communityContributions: 14,
    progress: {
      overall: 68,
      basicSigns: 92,
      advancedSigns: 55,
      everydayConversations: 87,
      culturalContext: 42
    },
    upcomingEvents: [
      { id: 1, title: "Interactive Sign Workshop", date: "2023-11-15", time: "3:00 PM", participants: 24 },
      { id: 2, title: "Deaf Community Meetup", date: "2023-11-20", time: "5:30 PM", participants: 42 },
    ],
    badges: [
      { id: 1, name: "Weekly Champion", icon: "Medal", color: "gold" },
      { id: 2, name: "Fast Learner", icon: "Zap", color: "purple" },
      { id: 3, name: "Community Helper", icon: "Heart", color: "red" },
    ]
  };

  // Icon mapping for badge rendering
  const iconMap = {
    Medal: Medal,
    Zap: Zap,
    Heart: Heart
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <Navbar />
      {/* Sidebar and Navbar would be imported components */}
      <div className="flex-1 p-8 ml-64 mt-20">
        {/* Profile Header */}
        <div className="relative mb-12">
          {/* Banner background with gradient */}
          <div className="h-48 w-full rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
          
          {/* Profile card that overlays the banner */}
          <div className="absolute -bottom-10 w-full">
            <div className="mx-8 bg-white rounded-xl shadow-lg p-6 flex justify-between items-end">
              <div className="flex items-center gap-6">
                {/* Profile picture with border */}
                <div className="relative -mt-20">
                  <div className="rounded-full w-32 h-32 border-4 border-white overflow-hidden shadow-lg">
                    <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-2 border-white"></div>
                </div>
                
                {/* User info */}
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
                  <p className="text-gray-500">{user.email}</p>
                  <div className="flex items-center mt-2 bg-indigo-50 px-3 py-1 rounded-full w-fit">
                    <HandMetal size={16} className="text-indigo-600 mr-2" />
                    <span className="text-indigo-700 font-medium">{user.signLanguageLevel} Sign Language</span>
                  </div>
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition shadow-sm flex items-center">
                  <Bell size={16} className="mr-2" />
                  Notifications
                </button>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-md flex items-center">
                  <Settings size={16} className="mr-2" />
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content area with spacing for the overlapping profile card */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Stats and Achievements */}
          <div className="lg:col-span-1 space-y-6">
            {/* Stats cards with subtle gradient backgrounds */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-800">Learning Stats</h2>
              </div>
              <div className="grid grid-cols-2 divide-x divide-y divide-gray-100">
                <div className="p-5 bg-gradient-to-br from-blue-50 to-transparent">
                  <div className="text-3xl font-bold text-blue-600">{user.completedCourses}</div>
                  <div className="text-sm text-gray-600 flex items-center">
                    <BookOpen size={14} className="mr-1" /> Courses Completed
                  </div>
                </div>
                <div className="p-5 bg-gradient-to-br from-purple-50 to-transparent">
                  <div className="text-3xl font-bold text-purple-600">{user.streak}</div>
                  <div className="text-sm text-gray-600 flex items-center">
                    <Zap size={14} className="mr-1" /> Day Streak
                  </div>
                </div>
                <div className="p-5 bg-gradient-to-br from-green-50 to-transparent">
                  <div className="text-3xl font-bold text-green-600">{user.achievements}</div>
                  <div className="text-sm text-gray-600 flex items-center">
                    <Award size={14} className="mr-1" /> Achievements
                  </div>
                </div>
                <div className="p-5 bg-gradient-to-br from-red-50 to-transparent">
                  <div className="text-3xl font-bold text-red-600">{user.communityContributions}</div>
                  <div className="text-sm text-gray-600 flex items-center">
                    <Users size={14} className="mr-1" /> Community Points
                  </div>
                </div>
              </div>
            </div>
            
            {/* Badges and achievements */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-800">Your Badges</h2>
              </div>
              <div className="p-5">
                <div className="flex flex-wrap gap-4">
                  {user.badges.map(badge => {
                    const IconComponent = iconMap[badge.icon];
                    const colorMap = {
                      gold: "bg-yellow-100 text-yellow-600",
                      purple: "bg-purple-100 text-purple-600",
                      red: "bg-red-100 text-red-600"
                    };
                    return (
                      <div key={badge.id} className="flex flex-col items-center">
                        <div className={`w-16 h-16 rounded-full ${colorMap[badge.color]} flex items-center justify-center mb-2`}>
                          <IconComponent size={24} />
                        </div>
                        <span className="text-sm font-medium text-gray-700">{badge.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          
          {/* Right column - Progress and Events */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress section with animated bars */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-800">Learning Progress</h2>
                <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
                  <BarChart size={16} className="text-blue-600 mr-2" />
                  <span className="text-blue-700 font-medium">{user.progress.overall}% Overall</span>
                </div>
              </div>
              <div className="p-5 space-y-5">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Basic Sign Language</span>
                    <span className="text-sm font-medium text-blue-600">{user.progress.basicSigns}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full transition-all duration-500" 
                      style={{ width: `${user.progress.basicSigns}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Advanced Sign Language</span>
                    <span className="text-sm font-medium text-blue-600">{user.progress.advancedSigns}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2.5 rounded-full transition-all duration-500" 
                      style={{ width: `${user.progress.advancedSigns}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Everyday Conversations</span>
                    <span className="text-sm font-medium text-blue-600">{user.progress.everydayConversations}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-600 h-2.5 rounded-full transition-all duration-500" 
                      style={{ width: `${user.progress.everydayConversations}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Cultural Context</span>
                    <span className="text-sm font-medium text-blue-600">{user.progress.culturalContext}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-pink-500 to-red-600 h-2.5 rounded-full transition-all duration-500" 
                      style={{ width: `${user.progress.culturalContext}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Upcoming events with modern cards */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-800">Upcoming Events</h2>
              </div>
              <div className="p-5 space-y-4">
                {user.upcomingEvents.map(event => (
                  <div key={event.id} className="rounded-lg bg-gradient-to-r from-gray-50 to-white border border-gray-100 hover:shadow-md transition duration-300 overflow-hidden">
                    <div className="flex items-center p-4">
                      <div className="flex-shrink-0 w-16 h-16 bg-indigo-100 text-indigo-700 rounded-lg flex flex-col items-center justify-center mr-4">
                        <span className="text-sm font-bold">{event.date.split('-')[2]}</span>
                        <span className="text-xs">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-lg font-bold text-gray-800">{event.title}</h3>
                        <div className="flex items-center space-x-4 mt-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock size={14} className="mr-1" /> {event.time}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Users size={14} className="mr-1" /> {event.participants} Participants
                          </div>
                        </div>
                      </div>
                      <button className="ml-4 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-md text-sm flex items-center">
                        <Calendar size={14} className="mr-1" />
                        Join
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
                <button className="text-indigo-600 hover:text-indigo-800 font-medium text-sm">View All Upcoming Events</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DProfile;