// components/Sidebar.jsx
import React from 'react';
import { Book, Video, Users, MessageSquare, FileText, Code2, Volume2, VolumeX, Mic, MicOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ isSpeaking, toggleSpeaking, listening, toggleListening }) => {
  const navigate = useNavigate();

  const sections = [
    { name: 'Learning', icon: <Book className="h-5 w-5" />, path: '/learning' },
    { name: 'Videos', icon: <Video className="h-5 w-5" />, path: '/videos' },
    { name: 'Community', icon: <Users className="h-5 w-5" />, path: '/community' },
    { name: 'Resources', icon: <MessageSquare className="h-5 w-5" />, path: '/resources' },
    { name: 'PDF Reader', icon: <FileText className="h-5 w-5" />, path: '/reader' },
    { name: 'AI Tutor', icon: <Code2 className="h-5 w-5" />, path: '/aitutor' },
  ];

  return (
    <div className="w-64 bg-white h-screen shadow-lg fixed">
      <div className="p-6">
        <h1 className="text-xl font-bold mb-6">ShikshaSoladu.ai</h1>
        <nav>
          <ul className="space-y-4">
            {sections.map((section) => (
              <li key={section.name}>
                <button
                  onClick={() => navigate(section.path)}
                  className="flex items-center space-x-2 w-full p-2 rounded-lg hover:bg-gray-100"
                >
                  {section.icon}
                  <span>{section.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <button
          onClick={toggleSpeaking}
          className={`flex items-center space-x-2 w-full p-2 rounded-lg ${isSpeaking ? 'bg-red-100' : 'bg-blue-100'}`}
        >
          {isSpeaking ? <VolumeX className="h-5 w-5 text-red-500" /> : <Volume2 className="h-5 w-5 text-blue-500" />}
          <span>{isSpeaking ? 'Stop Reading' : 'Read Aloud'}</span>
        </button>
        <button
          onClick={toggleListening}
          className={`flex items-center space-x-2 w-full p-2 rounded-lg mt-4 ${listening ? 'bg-red-100' : 'bg-gray-100'}`}
        >
          {listening ? <Mic className="h-5 w-5 text-red-500" /> : <MicOff className="h-5 w-5 text-gray-500" />}
          <span>{listening ? 'Stop Listening' : 'Start Listening'}</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;