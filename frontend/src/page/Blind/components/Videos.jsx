import React, { useState, useEffect, useRef } from 'react';
import { Search, Mic, Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, X, ChevronDown, ChevronUp, BookOpen, Award, Brain } from 'lucide-react';

const EnhancedVideoPlayer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(-1);
  const [isListening, setIsListening] = useState(false);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showPlaylist, setShowPlaylist] = useState(true);
  const [playerExpanded, setPlayerExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState('Education');
  
  const API_KEY = 'AIzaSyAKJ2W6-Y9ImKrh_MNZtJP2BAPoff8cdko'; // Replace with your API key for testing
  const searchInputRef = useRef(null);
  const videoPlayerRef = useRef(null);
  const recognitionRef = useRef(null);

  // Define sections with their icons and queries - Updated for blind/disabled people
  const sections = [
    { id: 'Education', icon: <BookOpen size={18} />, query: 'education for blind people assistive technology' },
    { id: 'Motivation', icon: <Award size={18} />, query: 'motivation for disabled people inspirational stories' },
    { id: 'Brain Focus', icon: <Brain size={18} />, query: 'calming sounds meditation for blind people focus techniques' }
  ];

  useEffect(() => {
    // Load initial videos based on the default section
    loadSectionVideos(activeSection);
    
    // Set up keyboard listener for spacebar and enter key
    const handleKeyDown = (e) => {
      // Handle spacebar for voice search
      if (e.code === 'Space' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        e.preventDefault();
        toggleVoiceSearch();
      }
      
      // Handle Enter key for search
      if (e.code === 'Enter' && !isListening) {
        handleSearch();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isListening]);

  const loadSectionVideos = async (sectionId) => {
    setLoading(true);
    const section = sections.find(s => s.id === sectionId);
    const query = section ? section.query : 'educational videos for blind people';
    
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=24&q=${query}&type=video&key=${API_KEY}`
      );
      const data = await response.json();
      if (data.items) {
        setVideos(data.items);
        setFilteredVideos(data.items);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    searchVideos();
  };

  const searchVideos = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=24&q=${searchTerm}&type=video&key=${API_KEY}`
      );
      const data = await response.json();
      if (data.items) {
        setVideos(data.items);
        setFilteredVideos(data.items);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleVoiceSearch = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        // Automatically search with the recognized term when spacebar is pressed the second time
        searchVideos();
      }
    } else {
      startVoiceRecognition();
    }
  };

  const startVoiceRecognition = () => {
    // Check if browser supports speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchTerm(transcript);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current.start();
    } else {
      alert('Speech recognition is not supported in your browser');
    }
  };

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    loadSectionVideos(sectionId);
  };

  const playVideo = (index) => {
    setCurrentVideoIndex(index);
    setIsPlaying(true);
    setPlayerExpanded(true);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const playPrevious = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
      setIsPlaying(true);
    }
  };

  const playNext = () => {
    if (currentVideoIndex < filteredVideos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = (e) => {
    if (videoPlayerRef.current) {
      setCurrentTime(videoPlayerRef.current.currentTime);
    }
  };

  const handleDurationChange = (e) => {
    if (videoPlayerRef.current) {
      setDuration(videoPlayerRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    setCurrentTime(seekTime);
    if (videoPlayerRef.current) {
      videoPlayerRef.current.currentTime = seekTime;
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white transition-colors duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white bg-opacity-20">
              <Volume2 size={18} />
            </div>
            <h1 className="text-2xl font-bold">EduFocus</h1>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="sticky top-0 z-10 bg-gray-800 p-4 shadow-md">
        <div className="container mx-auto">
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <div className={`relative flex-grow rounded-xl overflow-hidden ${isListening ? 'ring-2 ring-purple-500 pulse-animation' : ''}`}>
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for videos or press spacebar to search by voice..."
                className="w-full p-3 pl-12 bg-gray-700 text-white focus:outline-none transition-colors duration-300"
                aria-label="Search input. Press spacebar to start voice search."
              />
              <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
              <div className="absolute right-2 top-2">
                <button
                  type="button"
                  onClick={toggleVoiceSearch}
                  className={`p-2 rounded-full ${isListening ? 'bg-red-500 text-white' : 'bg-gray-600 text-gray-300'} hover:opacity-80 transition`}
                  aria-label={isListening ? "Stop voice search and search" : "Start voice search"}
                >
                  <Mic size={18} />
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition"
              aria-label="Search button"
            >
              Search
            </button>
          </form>

          {/* Sections */}
          <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2 scrollbar-thin">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => handleSectionChange(section.id)}
                className={`px-5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                  activeSection === section.id 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
                aria-label={`${section.id} section`}
                aria-pressed={activeSection === section.id}
              >
                {section.icon}
                {section.id}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow overflow-hidden flex flex-col">
        {/* Video Grid or Player */}
        <div className="flex-grow overflow-hidden flex flex-col md:flex-row">
          {/* Video Player Section */}
          {currentVideoIndex >= 0 && filteredVideos[currentVideoIndex] && playerExpanded && (
            <div className={`${showPlaylist ? 'md:w-2/3' : 'w-full'} bg-black flex flex-col transition-all duration-300`}>
              <div className="relative w-full pt-[56.25%] bg-black">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${filteredVideos[currentVideoIndex].id.videoId}?autoplay=${isPlaying ? 1 : 0}&rel=0`}
                  title={filteredVideos[currentVideoIndex].snippet.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  aria-label={`Now playing: ${filteredVideos[currentVideoIndex].snippet.title}`}
                ></iframe>
              </div>
              
              <div className="bg-gray-900 text-white p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold line-clamp-2">{filteredVideos[currentVideoIndex].snippet.title}</h2>
                    <p className="text-gray-300 mt-1">{filteredVideos[currentVideoIndex].snippet.channelTitle}</p>
                  </div>
                  <button 
                    onClick={() => setShowPlaylist(!showPlaylist)}
                    className="p-2 rounded-full hover:bg-gray-700 transition-colors ml-4"
                    aria-label={showPlaylist ? "Hide playlist" : "Show playlist"}
                  >
                    {showPlaylist ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                  </button>
                </div>
                
                {/* Custom Seek Bar */}
                <div className="mt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">{formatTime(currentTime)}</span>
                    <div className="flex-grow relative">
                      <input
                        type="range"
                        min="0"
                        max={duration || 100}
                        value={currentTime}
                        onChange={handleSeek}
                        className="w-full h-2 rounded-full appearance-none cursor-pointer bg-gray-700 accent-purple-500"
                        aria-label="Video progress"
                        aria-valuemin="0"
                        aria-valuemax={duration}
                        aria-valuenow={currentTime}
                      />
                      <div 
                        className="absolute top-0 left-0 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" 
                        style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-400">{formatTime(duration)}</span>
                  </div>
                </div>
              </div>
              
              {/* Video Controls */}
              <div className="bg-gray-900 p-4 border-t border-gray-700">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <button onClick={playPrevious} className="p-2 rounded-full hover:bg-gray-700 transition" aria-label="Previous video">
                      <SkipBack size={22} />
                    </button>
                    
                    <button 
                      onClick={togglePlayPause} 
                      className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full hover:opacity-90 transition shadow-lg"
                      aria-label={isPlaying ? "Pause" : "Play"}
                    >
                      {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                    </button>
                    
                    <button onClick={playNext} className="p-2 rounded-full hover:bg-gray-700 transition" aria-label="Next video">
                      <SkipForward size={22} />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button onClick={toggleMute} className="p-2 rounded-full hover:bg-gray-700 transition" aria-label={isMuted ? "Unmute" : "Mute"}>
                      {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-24 md:w-32 h-2 rounded-full appearance-none cursor-pointer bg-gray-700 accent-purple-500"
                      aria-label="Volume control"
                      aria-valuemin="0"
                      aria-valuemax="100"
                      aria-valuenow={isMuted ? 0 : volume}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Video Grid/List */}
          <div 
            className={`${
              currentVideoIndex >= 0 && playerExpanded 
                ? (showPlaylist ? 'md:w-1/3 md:block' : 'hidden') 
                : 'w-full'
            } overflow-y-auto bg-gray-900 transition-all duration-300`}
          >
            {loading ? (
              <div className="flex justify-center items-center h-40 mt-8">
                <div className="relative w-16 h-16">
                  <div className="absolute top-0 left-0 w-full h-full border-4 border-t-purple-500 border-r-indigo-500 border-b-purple-300 border-l-indigo-300 rounded-full animate-spin"></div>
                </div>
                <span className="sr-only">Loading videos...</span>
              </div>
            ) : (
              <div className="container mx-auto p-4">
                {currentVideoIndex >= 0 && playerExpanded && (
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Up Next</h2>
                    <button 
                      onClick={() => setPlayerExpanded(false)} 
                      className="p-1.5 rounded-full hover:bg-gray-700"
                      aria-label="Minimize player"
                    >
                      <X size={18} />
                    </button>
                  </div>
                )}
                
                <div className={`grid grid-cols-1 ${
                  currentVideoIndex >= 0 && playerExpanded 
                    ? 'sm:grid-cols-1' 
                    : 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                } gap-4`}>
                  {filteredVideos.map((video, index) => (
                    <div 
                      key={video.id.videoId} 
                      className={`bg-gray-800 hover:bg-gray-750 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition cursor-pointer group ${
                        currentVideoIndex === index ? 'border-2 border-purple-600' : ''
                      }`}
                      onClick={() => playVideo(index)}
                      role="button"
                      aria-label={`Play video: ${video.snippet.title}`}
                      tabIndex="0"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          playVideo(index);
                        }
                      }}
                    >
                      <div className="relative">
                        <img
                          src={video.snippet.thumbnails.high?.url || video.snippet.thumbnails.medium.url}
                          alt={video.snippet.title}
                          className="w-full aspect-video object-cover group-hover:opacity-90 transition"
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                          <div className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-opacity-80 rounded-full">
                            <Play size={24} className="text-white" />
                          </div>
                        </div>
                        {currentVideoIndex === index && isPlaying && (
                          <div className="absolute bottom-2 right-2 p-1.5 bg-purple-600 rounded-md">
                            <Pause size={16} className="text-white" />
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium line-clamp-2 text-sm">{video.snippet.title}</h3>
                        <p className="text-xs mt-1 text-gray-400">{video.snippet.channelTitle}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Voice Recognition Indicator */}
      {isListening && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 px-4 rounded-full shadow-lg flex items-center gap-2 z-50">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <span>Listening... Press spacebar again to search</span>
        </div>
      )}

      {/* Mini Player when video is selected but full player is minimized */}
      {currentVideoIndex >= 0 && !playerExpanded && filteredVideos[currentVideoIndex] && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-800 shadow-lg flex items-center p-2 z-40">
          <div className="flex items-center flex-grow gap-3">
            <img 
              src={filteredVideos[currentVideoIndex].snippet.thumbnails.default.url} 
              alt={filteredVideos[currentVideoIndex].snippet.title}
              className="w-14 h-12 object-cover rounded"
            />
            <div className="flex-grow min-w-0">
              <h3 className="font-medium text-sm line-clamp-1">{filteredVideos[currentVideoIndex].snippet.title}</h3>
              <p className="text-xs text-gray-400">{filteredVideos[currentVideoIndex].snippet.channelTitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={playPrevious} className="p-1.5 rounded-full hover:bg-gray-700 transition" aria-label="Previous video">
              <SkipBack size={18} />
            </button>
            <button 
              onClick={togglePlayPause} 
              className="p-2 rounded-full bg-purple-700 hover:bg-purple-600 text-white transition"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>
            <button onClick={playNext} className="p-1.5 rounded-full hover:bg-gray-700 transition" aria-label="Next video">
              <SkipForward size={18} />
            </button>
            <button 
              onClick={() => setPlayerExpanded(true)} 
              className="p-1.5 rounded-full hover:bg-gray-700 transition ml-2"
              aria-label="Expand player"
            >
              <ChevronUp size={18} />
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .pulse-animation {
          animation: pulse 1.5s infinite;
        }
        
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(99, 102, 241, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
          }
        }
        
        /* Custom scrollbar */
        .scrollbar-thin::-webkit-scrollbar {
          height: 4px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #374151;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #6366f1;
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
};

export default EnhancedVideoPlayer;