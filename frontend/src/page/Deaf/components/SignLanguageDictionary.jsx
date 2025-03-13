import React, { useState } from "react";
import { motion } from "framer-motion";
import ReactPlayer from "react-player";

const signs = [
  { word: "Hello", video: "https://www.youtube.com/watch?v=example1" },
  { word: "Thank You", video: "https://www.youtube.com/watch?v=example2" },
  { word: "Help", video: "https://www.youtube.com/watch?v=example3" },
];

export default function SignLanguageDictionary() {
  const [selectedSign, setSelectedSign] = useState(signs[0]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">
        Interactive Sign Language Dictionary
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Words</h3>
          <ul className="space-y-2">
            {signs.map((sign, index) => (
              <motion.li
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedSign(sign)}
                className="cursor-pointer p-2 bg-gray-100 rounded-lg"
              >
                {sign.word}
              </motion.li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Sign Video</h3>
          <div className="aspect-video">
            <ReactPlayer
              url={selectedSign.video}
              controls={true}
              width="100%"
              height="100%"
            />
          </div>
        </div>
      </div>
      <p className="text-gray-700 mt-4">
        Explore and learn sign language through interactive dictionaries.
      </p>
    </div>
  );
}