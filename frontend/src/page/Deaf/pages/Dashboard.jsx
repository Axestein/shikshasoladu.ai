import React, { useState } from "react";
import { BarChart, LineChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Calendar, Award, Clock, Book, Video, MessageSquare, Star, Users, Zap } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  // Sample data for charts
  const weeklyProgressData = [
    { day: "Mon", signLanguage: 45, visualLearning: 30, reading: 20 },
    { day: "Tue", signLanguage: 50, visualLearning: 25, reading: 35 },
    { day: "Wed", signLanguage: 35, visualLearning: 40, reading: 25 },
    { day: "Thu", signLanguage: 55, visualLearning: 35, reading: 30 },
    { day: "Fri", signLanguage: 40, visualLearning: 45, reading: 40 },
    { day: "Sat", signLanguage: 60, visualLearning: 50, reading: 45 },
    { day: "Sun", signLanguage: 50, visualLearning: 35, reading: 30 }
  ];

  const monthlyProgressData = [
    { month: "Jan", progress: 70 },
    { month: "Feb", progress: 75 },
    { month: "Mar", progress: 80 },
    { month: "Apr", progress: 78 },
    { month: "May", progress: 82 },
    { month: "Jun", progress: 85 }
  ];

  const skillsData = [
    { skill: "Alphabet", mastery: 90 },
    { skill: "Numbers", mastery: 85 },
    { skill: "Common Phrases", mastery: 75 },
    { skill: "Conversation", mastery: 65 },
    { skill: "Academic Terms", mastery: 70 }
  ];

  // Learning streak state
  const [activeTab, setActiveTab] = useState("progress");

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <Navbar />
      <div className="flex-1 ml-64 mt-20 container p-6">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-700">Your Learning Dashboard</h1>
          <div className="bg-indigo-100 rounded-full p-3 text-indigo-700 font-semibold flex items-center gap-2">
            <Clock size={20} /> Learning Streak: 42 days
          </div>
        </header>

        {/* Dashboard Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            className={`px-6 py-3 font-medium text-lg ${activeTab === "progress" ? "text-indigo-700 border-b-2 border-indigo-700" : "text-gray-500 hover:text-indigo-600"}`}
            onClick={() => setActiveTab("progress")}
          >
            Learning Progress
          </button>
          <button
            className={`px-6 py-3 font-medium text-lg ${activeTab === "skills" ? "text-indigo-700 border-b-2 border-indigo-700" : "text-gray-500 hover:text-indigo-600"}`}
            onClick={() => setActiveTab("skills")}
          >
            Sign Language Skills
          </button>
          <button
            className={`px-6 py-3 font-medium text-lg ${activeTab === "achievements" ? "text-indigo-700 border-b-2 border-indigo-700" : "text-gray-500 hover:text-indigo-600"}`}
            onClick={() => setActiveTab("achievements")}
          >
            Achievements
          </button>
        </div>

        {/* Main Dashboard Content */}
        {activeTab === "progress" && (
          <>
            {/* Weekly Activity Chart */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Zap size={24} className="text-indigo-600" /> Weekly Learning Activity
              </h2>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyProgressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis label={{ value: 'Minutes Spent', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="signLanguage" name="Sign Language" fill="#6366F1" />
                    <Bar dataKey="visualLearning" name="Visual Learning" fill="#F59E0B" />
                    <Bar dataKey="reading" name="Reading" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* Monthly Progress & Points Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Book size={24} className="text-indigo-600" /> Monthly Progress
                </h2>
                <div className="bg-white p-6 rounded-xl shadow-md h-full">
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={monthlyProgressData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis label={{ value: 'Completion %', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="progress" name="Learning Progress" stroke="#6366F1" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Award size={24} className="text-indigo-600" /> Points Summary
                </h2>
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <div className="text-center p-4 border-b border-gray-100">
                    <h3 className="text-lg font-medium text-gray-600">Total Points</h3>
                    <p className="text-4xl font-bold text-indigo-700 mt-2">3,845</p>
                  </div>
                  <div className="grid grid-cols-2 divide-x divide-gray-100 mt-4">
                    <div className="text-center p-4">
                      <h3 className="text-lg font-medium text-gray-600">This Week</h3>
                      <p className="text-3xl font-bold text-indigo-700 mt-2">275</p>
                    </div>
                    <div className="text-center p-4">
                      <h3 className="text-lg font-medium text-gray-600">Daily Avg</h3>
                      <p className="text-3xl font-bold text-indigo-700 mt-2">39</p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Level Progress</span>
                      <span className="text-indigo-700 font-medium">78%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: "78%" }}></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">122 points until Level 8</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Lessons */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Calendar size={24} className="text-indigo-600" /> Upcoming Lessons
              </h2>
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-indigo-50">
                      <tr>
                        <th className="py-3 px-6 text-left text-sm font-medium text-indigo-700">Lesson</th>
                        <th className="py-3 px-6 text-left text-sm font-medium text-indigo-700">Type</th>
                        <th className="py-3 px-6 text-left text-sm font-medium text-indigo-700">Date</th>
                        <th className="py-3 px-6 text-left text-sm font-medium text-indigo-700">Duration</th>
                        <th className="py-3 px-6 text-left text-sm font-medium text-indigo-700">Points</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr className="hover:bg-indigo-50">
                        <td className="py-4 px-6 text-gray-700">Advanced Signing Practice</td>
                        <td className="py-4 px-6"><span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">Live Session</span></td>
                        <td className="py-4 px-6 text-gray-700">Today, 4:00 PM</td>
                        <td className="py-4 px-6 text-gray-700">45 min</td>
                        <td className="py-4 px-6 text-gray-700">50</td>
                      </tr>
                      <tr className="hover:bg-indigo-50">
                        <td className="py-4 px-6 text-gray-700">Visual Storytelling Techniques</td>
                        <td className="py-4 px-6"><span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">On-demand</span></td>
                        <td className="py-4 px-6 text-gray-700">Tomorrow</td>
                        <td className="py-4 px-6 text-gray-700">30 min</td>
                        <td className="py-4 px-6 text-gray-700">35</td>
                      </tr>
                      <tr className="hover:bg-indigo-50">
                        <td className="py-4 px-6 text-gray-700">STEM Vocabulary in Sign Language</td>
                        <td className="py-4 px-6"><span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">Interactive</span></td>
                        <td className="py-4 px-6 text-gray-700">Mar 16, 2:30 PM</td>
                        <td className="py-4 px-6 text-gray-700">60 min</td>
                        <td className="py-4 px-6 text-gray-700">70</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </>
        )}

        {activeTab === "skills" && (
          <>
            {/* Sign Language Skills */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Video size={24} className="text-indigo-600" /> Sign Language Proficiency
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h3 className="text-xl font-medium text-indigo-700 mb-4">Skill Mastery</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart layout="vertical" data={skillsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis dataKey="skill" type="category" width={150} />
                      <Tooltip />
                      <Bar dataKey="mastery" name="Mastery Level %" fill="#6366F1" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h3 className="text-xl font-medium text-indigo-700 mb-4">Vocabulary Progress</h3>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700 font-medium">Common Phrases</span>
                        <span className="text-indigo-700">156/200</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: "78%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700 font-medium">Academic Terms</span>
                        <span className="text-indigo-700">94/150</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: "63%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700 font-medium">Professional Vocabulary</span>
                        <span className="text-indigo-700">52/120</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: "43%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700 font-medium">Cultural References</span>
                        <span className="text-indigo-700">78/100</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: "78%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Recent Practice Sessions */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Clock size={24} className="text-indigo-600" /> Recent Practice Sessions
              </h2>
              <div className="bg-white rounded-xl shadow-md">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-indigo-50">
                      <tr>
                        <th className="py-3 px-6 text-left text-sm font-medium text-indigo-700">Date</th>
                        <th className="py-3 px-6 text-left text-sm font-medium text-indigo-700">Session Type</th>
                        <th className="py-3 px-6 text-left text-sm font-medium text-indigo-700">Duration</th>
                        <th className="py-3 px-6 text-left text-sm font-medium text-indigo-700">Accuracy</th>
                        <th className="py-3 px-6 text-left text-sm font-medium text-indigo-700">Review</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr className="hover:bg-indigo-50">
                        <td className="py-4 px-6 text-gray-700">Mar 13, 2025</td>
                        <td className="py-4 px-6 text-gray-700">Vocabulary Quiz</td>
                        <td className="py-4 px-6 text-gray-700">15 min</td>
                        <td className="py-4 px-6"><span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">92%</span></td>
                        <td className="py-4 px-6"><button className="text-indigo-600 hover:text-indigo-800">Review</button></td>
                      </tr>
                      <tr className="hover:bg-indigo-50">
                        <td className="py-4 px-6 text-gray-700">Mar 12, 2025</td>
                        <td className="py-4 px-6 text-gray-700">Conversation Practice</td>
                        <td className="py-4 px-6 text-gray-700">25 min</td>
                        <td className="py-4 px-6"><span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">78%</span></td>
                        <td className="py-4 px-6"><button className="text-indigo-600 hover:text-indigo-800">Review</button></td>
                      </tr>
                      <tr className="hover:bg-indigo-50">
                        <td className="py-4 px-6 text-gray-700">Mar 10, 2025</td>
                        <td className="py-4 px-6 text-gray-700">Sign Recognition</td>
                        <td className="py-4 px-6 text-gray-700">20 min</td>
                        <td className="py-4 px-6"><span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">86%</span></td>
                        <td className="py-4 px-6"><button className="text-indigo-600 hover:text-indigo-800">Review</button></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </>
        )}

        {activeTab === "achievements" && (
          <>
            {/* Achievements Grid */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Award size={24} className="text-indigo-600" /> Your Achievements
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-indigo-600">
                  <div className="flex items-start">
                    <div className="rounded-full bg-indigo-100 p-3 mr-4">
                      <Award size={24} className="text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-indigo-700 mb-2">Signing Scholar</h3>
                      <p className="text-gray-600 mb-2">Completed all beginner sign language courses</p>
                      <p className="text-sm text-indigo-600 font-medium">Earned on March 5, 2025</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-500">
                  <div className="flex items-start">
                    <div className="rounded-full bg-yellow-100 p-3 mr-4">
                      <Star size={24} className="text-yellow-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-yellow-600 mb-2">Perfect Streak</h3>
                      <p className="text-gray-600 mb-2">Maintained a 30+ day learning streak</p>
                      <p className="text-sm text-yellow-600 font-medium">Earned on February 18, 2025</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-600">
                  <div className="flex items-start">
                    <div className="rounded-full bg-green-100 p-3 mr-4">
                      <Users size={24} className="text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-green-600 mb-2">Community Guide</h3>
                      <p className="text-gray-600 mb-2">Helped 10+ students in the community forum</p>
                      <p className="text-sm text-green-600 font-medium">Earned on January 25, 2025</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-600 opacity-50">
                  <div className="flex items-start">
                    <div className="rounded-full bg-purple-100 p-3 mr-4">
                      <Video size={24} className="text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-purple-600 mb-2">Video Master</h3>
                      <p className="text-gray-600 mb-2">Upload 5 practice videos for feedback</p>
                      <p className="text-sm text-purple-600 font-medium">2/5 completed</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-600 opacity-50">
                  <div className="flex items-start">
                    <div className="rounded-full bg-blue-100 p-3 mr-4">
                      <Book size={24} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-blue-600 mb-2">Story Teller</h3>
                      <p className="text-gray-600 mb-2">Complete an entire story in sign language</p>
                      <p className="text-sm text-blue-600 font-medium">In progress - 60% complete</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-pink-600 opacity-50">
                  <div className="flex items-start">
                    <div className="rounded-full bg-pink-100 p-3 mr-4">
                      <MessageSquare size={24} className="text-pink-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-pink-600 mb-2">Conversation Pro</h3>
                      <p className="text-gray-600 mb-2">Score 90%+ on 3 conversation assessments</p>
                      <p className="text-sm text-pink-600 font-medium">1/3 completed</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}