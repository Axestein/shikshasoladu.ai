import React from "react";
import Navbar from "./components/Navbar";
import ProgressChart from "./components/ProgressChart";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold text-blue-600 mb-8">Dashboard</h1>

        {/* Weekly Progress Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">
            Weekly Progress
          </h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <ProgressChart />
          </div>
        </section>

        {/* Points Earned Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">
            Points Earned
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-2xl font-bold text-blue-600 mb-2">
                Total Points
              </h3>
              <p className="text-4xl font-bold text-gray-800">1,250</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-2xl font-bold text-blue-600 mb-2">
                This Week
              </h3>
              <p className="text-4xl font-bold text-gray-800">60</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-2xl font-bold text-blue-600 mb-2">
                Last Week
              </h3>
              <p className="text-4xl font-bold text-gray-800">45</p>
            </div>
          </div>
        </section>

        {/* Achievements Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">
            Achievements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-2xl font-bold text-blue-600 mb-2">
                🏆 Top Learner
              </h3>
              <p className="text-gray-700">Earned for scoring the highest points this month.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-2xl font-bold text-blue-600 mb-2">
                📚 Course Master
              </h3>
              <p className="text-gray-700">Completed 10 courses this year.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-2xl font-bold text-blue-600 mb-2">
                🎮 Quiz Champion
              </h3>
              <p className="text-gray-700">Won 5 quizzes in a row.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-2xl font-bold text-blue-600 mb-2">
                💡 Bright Idea
              </h3>
              <p className="text-gray-700">Shared 3 innovative ideas in the forum.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}