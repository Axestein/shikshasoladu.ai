import React from "react";
import KanbanBoard from "../components/KanbanBoard";
import Calendar from "../components/Calender";
import { FaCalendarAlt, FaTasks } from "react-icons/fa"; // For icons
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const PlanYourDay = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:bg-gray-900 p-8 flex">
      {/* Sidebar and Navbar */}
      <Sidebar />
      <div className="flex-1 ml-64"> {/* Space for sidebar */}
        <Navbar />

        <div className="max-w-7xl mx-auto mt-10">
          {/* Section Header */}
          <div className="w-full py-16 px-4 mb-8">
            <div className="max-w-7xl mx-auto text-center">
              {/* Main Heading */}
              <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
                <span className="relative inline-block mx-2">
                  Empower Your Learning Journey by
                  <span className="before:block before:absolute before:-inset-1 before:-skew-y-3 
                                 before:bg-gradient-to-r before:from-blue-500 before:to-cyan-500 relative inline-block">
                    <span className="relative text-white">Planning Your Day</span>
                  </span>
                </span>
              </h1>

              {/* Enhanced Subheading */}
              <p className="text-xl text-gray-600 mb-1 max-w-3xl mx-auto leading-relaxed">
                Stay on top of your learning with our Kanban board and calendar tools.
                Track assignments, classes, and important events tailored for Deaf students.
              </p>
            </div>
          </div>

          {/* Kanban and Calendar Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
            {/* Kanban Board Section */}
            <div className="flex-1 border-2 border-gray-200 dark:border-gray-700 p-6 rounded-lg bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 hover:shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-semibold text-gray-800 dark:text-white">
                  <FaTasks className="inline-block mr-2 text-blue-500" />
                  Manage Your Assignments
                </h2>
                <button className="bg-blue-500 p-1 hover:text-gray-300 text-white font-medium rounded-2xl transition duration-300">
                  Organize Tasks
                </button>
              </div>
              <KanbanBoard />
            </div>

            {/* Calendar Section */}
            <div className="flex-1 border-2 border-gray-200 dark:border-gray-700 p-6 rounded-lg bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 hover:shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-semibold text-gray-800 dark:text-white">
                  <FaCalendarAlt className="inline-block mr-2 text-green-500" />
                  Plan Your Classes and Events
                </h2>
                <button className="text-white hover:text-gray-300 bg-green-500 p-1 rounded-2xl font-medium transition duration-300">
                  Manage Calendar
                </button>
              </div>
              <Calendar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanYourDay;
