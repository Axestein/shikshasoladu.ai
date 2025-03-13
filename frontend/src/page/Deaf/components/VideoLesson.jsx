import React from "react";
import ReactPlayer from "react-player";

export default function VideoLesson() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">
        Video-Based Lessons with Captions
      </h2>
      <div className="aspect-video">
        <ReactPlayer
          url="https://www.youtube.com/watch?v=example" // Replace with your video URL
          controls={true}
          width="100%"
          height="100%"
          config={{
            youtube: {
              playerVars: { showinfo: 1, cc_load_policy: 1 }, // Enable captions
            },
          }}
        />
      </div>
      <p className="text-gray-700 mt-4">
        Watch video lessons with accurate captions for better understanding.
      </p>
    </div>
  );
}