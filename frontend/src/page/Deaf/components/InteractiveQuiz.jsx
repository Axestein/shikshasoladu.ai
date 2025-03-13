import React, { useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const questions = [
  {
    question: "What is the capital of France?",
    options: ["Paris", "London", "Berlin", "Madrid"],
    answer: "Paris",
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Saturn"],
    answer: "Mars",
  },
  {
    question: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    answer: "4",
  },
];

export default function InteractiveQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleNextQuestion = () => {
    if (selectedOption === questions[currentQuestion].answer) {
      setScore(score + 1);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption("");
    } else {
      setShowResult(true);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">
        Interactive Quiz with Visual Feedback
      </h2>
      {!showResult ? (
        <div>
          <h3 className="text-xl font-semibold mb-4">
            {questions[currentQuestion].question}
          </h3>
          <div className="space-y-4">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionSelect(option)}
                className={`w-full p-4 rounded-lg text-left ${
                  selectedOption === option
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          <button
            onClick={handleNextQuestion}
            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            {currentQuestion < questions.length - 1 ? "Next" : "Finish"}
          </button>
        </div>
      ) : (
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-4">Quiz Result</h3>
          <p className="text-gray-700">
            You scored {score} out of {questions.length}!
          </p>
          <div className="mt-4">
            {score === questions.length ? (
              <FaCheckCircle className="text-6xl text-green-600 mx-auto" />
            ) : (
              <FaTimesCircle className="text-6xl text-red-600 mx-auto" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}