import React from "react";
import ReactPlayer from "react-player";

export default function VideoPlayer() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">
        Video Tutorials with Sign Language Interpreters
      </h2>
      <div className="aspect-video">
        <ReactPlayer
          url="https://www.youtube.com/watch?v=example" // Replace with your video URL
          controls={true}
          width="100%"
          height="100%"
        />
      </div>
      <p className="text-gray-700 mt-4">
        Learn through video lessons accompanied by professional sign language interpreters.
      </p>
    </div>
  );
}