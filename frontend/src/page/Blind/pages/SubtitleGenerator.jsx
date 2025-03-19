import React, { useEffect, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { Volume2, VolumeX } from 'lucide-react';

function SubtitleGenerator({ onTranscript }) {
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window).webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join(' ');
        onTranscript(transcript);
      };

      setRecognition(recognition);
    }
  }, [onTranscript]);

  useHotkeys('ctrl+shift+s', () => {
    toggleRecording();
  });

  const toggleRecording = () => {
    if (!recognition) return;

    if (isRecording) {
      recognition.stop();
    } else {
      recognition.start();
    }
    setIsRecording(!isRecording);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={toggleRecording}
        className={`p-3 rounded-full shadow-lg transition-colors ${
          isRecording ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
        }`}
        aria-label={isRecording ? 'Stop recording' : 'Start recording'}
      >
        {isRecording ? (
          <VolumeX className="h-6 w-6" />
        ) : (
          <Volume2 className="h-6 w-6" />
        )}
      </button>
      <div className="mt-2 text-xs text-gray-600 text-center">
        Press Ctrl+Shift+S to {isRecording ? 'stop' : 'start'}
      </div>
    </div>
  );
}

export default SubtitleGenerator;