import React, { useState } from "react";
import { PlayCircle, Clock, Star, X } from "lucide-react";

export default function VideoLesson({ title, duration, thumbnail, channel, videoId }) {
  const [showVideoModal, setShowVideoModal] = useState(false); // State to control video modal

  return (
    <>
      {/* Video Lesson Card */}
      <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-6">
        <img
          src={thumbnail}
          alt={title}
          className="w-32 h-20 object-cover rounded-lg"
        />
        <div className="flex-1">
          <h3 className="text-xl font-bold text-blue-600">{title}</h3>
          <div className="flex items-center space-x-4 text-gray-600 mt-2">
            <Clock size={16} />
            <span>{duration}</span>
            <span className="text-sm text-gray-500">by {channel}</span>
          </div>
        </div>
        <button
          onClick={() => setShowVideoModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          <PlayCircle size={20} className="mr-2" />
          Watch Now
        </button>
      </div>

      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl relative">
            {/* Close Button */}
            <button
              onClick={() => setShowVideoModal(false)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
            >
              <X size={24} />
            </button>

            {/* Embedded YouTube Video */}
            <iframe
              width="100%"
              height="450"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              title={title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-t-lg"
            ></iframe>

            {/* Video Details */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-blue-600">{title}</h3>
              <div className="flex items-center space-x-4 text-gray-600 mt-2">
                <Clock size={16} />
                <span>{duration}</span>
                <span className="text-sm text-gray-500">by {channel}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}