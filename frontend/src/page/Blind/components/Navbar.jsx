import React from 'react';
import { Book, Video, MessageSquare, Users, FileText, Code2 } from 'lucide-react';

function BlindNavbar({ onNavigate }) {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            <div className="flex-shrink-0 flex items-center">
              <span className="ml-2 text-xl font-bold">BlindTech Ed</span>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <button 
                onClick={() => onNavigate('learning')}
                className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100"
              >
                <Book className="h-5 w-5 mr-1" /> Learning
              </button>
              <button 
                onClick={() => onNavigate('videos')}
                className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100"
              >
                <Video className="h-5 w-5 mr-1" /> Videos
              </button>
              <button 
                onClick={() => onNavigate('community')}
                className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100"
              >
                <Users className="h-5 w-5 mr-1" /> Community
              </button>
              <button 
                onClick={() => onNavigate('resources')}
                className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100"
              >
                <MessageSquare className="h-5 w-5 mr-1" /> Resources
              </button>
              <button 
                onClick={() => onNavigate('reader')}
                className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100"
              >
                <FileText className="h-5 w-5 mr-1" /> PDF Reader
              </button>
              <button 
                onClick={() => onNavigate('developer')}
                className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100"
              >
                <Code2 className="h-5 w-5 mr-1" /> Developer
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default BlindNavbar;