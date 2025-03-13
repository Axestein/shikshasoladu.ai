import React, { useState } from "react";
import { motion } from "framer-motion";

export default function SignLanguageTranslator() {
  const [text, setText] = useState("");

  const handleTranslate = () => {
    alert("Translation feature will be integrated with AI APIs.");
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">
        Real-Time Sign Language Translation
      </h2>
      <input
        type="text"
        placeholder="Enter text to translate"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-lg mb-4"
      />
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleTranslate}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        Translate
      </motion.button>
      <p className="text-gray-700 mt-4">
        Use AI-powered tools to translate spoken language into sign language in real-time.
      </p>
    </div>
  );
}