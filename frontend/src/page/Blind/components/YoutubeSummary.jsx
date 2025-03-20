import React, { useState, useEffect, useRef } from 'react';

const VoiceSearchAudioSummarizer = () => {
  const [isListening, setIsListening] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [error, setError] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const [speechRecognitionSupported, setSpeechRecognitionSupported] = useState(true);
  
  const recognitionRef = useRef(null);
  const synth = window.speechSynthesis;
  
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      try {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';
        
        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setSearchQuery(transcript);
          searchYouTubeVideos(transcript);
        };
        
        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setError(`Speech recognition error: ${event.error}. Please try again.`);
          setIsListening(false);
        };
        
        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      } catch (err) {
        console.error('Error initializing speech recognition:', err);
        setSpeechRecognitionSupported(false);
        setError('Error initializing speech recognition. This may be due to permissions being denied.');
      }
    } else {
      setSpeechRecognitionSupported(false);
      setError('Speech recognition not supported in this browser.');
    }
    
    // Add keyboard event listener for spacebar
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA' && !e.target.isContentEditable) {
        e.preventDefault();
        toggleListening();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (err) {
          console.error('Error stopping speech recognition:', err);
        }
      }
      if (synth.speaking) {
        synth.cancel();
      }
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  const announceMessage = (message) => {
    setAnnouncement(message);
  };
  
  const speakText = (text) => {
    if (!text) return;
    
    try {
      if (synth.speaking) {
        synth.cancel();
      }
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      synth.speak(utterance);
    } catch (err) {
      console.error('Speech synthesis error:', err);
    }
  };
  
  const toggleListening = () => {
    if (!speechRecognitionSupported) {
      setError('Speech recognition is not supported or permission was denied.');
      return;
    }
    
    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.error('Error stopping speech recognition:', err);
      }
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        setError('');
      } catch (err) {
        console.error('Speech recognition error:', err);
        setError('Error starting speech recognition. This may be due to permission issues. Please check your browser settings.');
        setIsListening(false);
      }
    }
  };
  
  const searchYouTubeVideos = async (query) => {
    if (!query) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const API_KEY = 'AIzaSyDCr32mGSwCm8fnIR9N7moXXg9hHTVTXJE';
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${encodeURIComponent(query)}&type=video&key=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      const videos = data.items.map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        description: item.snippet.description,
        thumbnailUrl: item.snippet.thumbnails.medium.url
      }));
      
      setSearchResults(videos);
      setIsLoading(false);
    } catch (error) {
      console.error('YouTube search error:', error);
      setError(`Error searching for videos: ${error.message}. Please try again.`);
      setIsLoading(false);
    }
  };
  
  const selectVideo = async (video) => {
    setSelectedVideo(video);
    setIsLoading(true);
    
    try {
      const API_KEY = 'AIzaSyDCr32mGSwCm8fnIR9N7moXXg9hHTVTXJE';
      
      const videoDetailsResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${video.id}&key=${API_KEY}`
      );
      
      if (!videoDetailsResponse.ok) {
        throw new Error(`YouTube API error: ${videoDetailsResponse.status}`);
      }
      
      const videoDetails = await videoDetailsResponse.json();
      
      const videoDescription = videoDetails.items[0].snippet.description;
      let generatedSummary;
      
      if (videoDescription && videoDescription.length > 100) {
        const sentences = videoDescription.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const firstFewSentences = sentences.slice(0, 3).join('. ');
        generatedSummary = `Summary of "${video.title}": ${firstFewSentences}. 
        
        This summary was generated from the video description. In a production environment, this would be a more comprehensive summary created from the full video transcript.`;
      } else {
        generatedSummary = `This video titled "${video.title}" by ${video.channelTitle} appears to have limited description information. 
        
        In a full implementation, we would extract and analyze the complete transcript to provide a detailed summary of the key points covered in the video.`;
      }
      
      setSummary(generatedSummary);
      setIsLoading(false);
      speakText(generatedSummary);
      setAudioPlaying(true);
    } catch (error) {
      console.error('Video transcript error:', error);
      setError(`Error getting video information: ${error.message}. Please try again.`);
      setIsLoading(false);
    }
  };
  
  const stopAudio = () => {
    if (synth.speaking) {
      synth.cancel();
    }
    setAudioPlaying(false);
  };
  
  const replayAudio = () => {
    if (summary) {
      speakText(summary);
      setAudioPlaying(true);
    }
  };
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery) {
      searchYouTubeVideos(searchQuery);
    }
  };
  
  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-indigo-600 mb-2">Educational Audio Assistant</h1>
          <p className="text-lg text-gray-700">Search YouTube videos with your voice and listen to summarized content</p>
        </header>
        
        <div className="sr-only" role="status" aria-live="polite">
          {announcement}
        </div>
        
        <section className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-xl shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-indigo-700 mb-4">Voice Search</h2>
          
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-center gap-4 mb-4">
            <button
              type="button"
              onClick={toggleListening}
              disabled={!speechRecognitionSupported}
              className={`flex items-center justify-center gap-2 p-4 rounded-full ${
                !speechRecognitionSupported 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : isListening 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-indigo-600 hover:bg-indigo-700'
              } text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400`}
              aria-label={isListening ? "Stop listening" : "Start voice search"}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d={isListening 
                    ? "M21 12a9 9 0 11-18 0 9 9 0 0118 0z M10 10l4 4m0-4l-4 4" 
                    : "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"} 
                />
              </svg>
              {isListening ? 'Stop' : 'Start Voice Search'}
            </button>
            
            <div className="flex-1 w-full">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-3 pl-10 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  placeholder="Your search query will appear here..."
                  aria-label="Search query"
                />
                <div className="absolute left-3 top-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400"
              aria-label="Search"
              disabled={!searchQuery || isLoading}
            >
              Search
            </button>
          </form>
          
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg mb-4" role="alert">
              {error}
            </div>
          )}
          
          <div className="flex items-center" aria-live="polite">
            {isListening ? (
              <div className="flex items-center text-indigo-600">
                <svg className="animate-pulse w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                </svg>
                <span>Listening... Speak now</span>
              </div>
            ) : (
              <div className="text-gray-600">
                {speechRecognitionSupported 
                  ? "Press Space or click the voice search button to start" 
                  : "Voice search is not available. Please type your search query."}
              </div>
            )}
          </div>
          
          {!speechRecognitionSupported && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="font-medium text-yellow-800">Speech Recognition Troubleshooting:</h3>
              <ul className="list-disc pl-5 mt-2 text-yellow-700 text-sm">
                <li>Make sure you're using a modern browser like Chrome, Edge, or Safari</li>
                <li>Check that you've granted microphone permissions to this website</li>
                <li>Try refreshing the page and allowing microphone access when prompted</li>
                <li>If using HTTPS, ensure your connection is secure</li>
                <li>You can still search by typing your query and clicking the Search button</li>
              </ul>
            </div>
          )}
        </section>
        
        {isLoading ? (
          <div className="text-center p-8 bg-white rounded-lg shadow-md">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
            <p className="mt-2 text-gray-700">Loading...</p>
          </div>
        ) : (
          <>
            {searchResults.length > 0 && !selectedVideo && (
              <section className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Search Results</h2>
                <div className="space-y-4">
                  {searchResults.map((video) => (
                    <div 
                      key={video.id}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-indigo-50 transition-colors cursor-pointer"
                      onClick={() => selectVideo(video)}
                      tabIndex="0"
                      role="button"
                      aria-label={`Select video: ${video.title} by ${video.channelTitle}`}
                      onKeyPress={(e) => e.key === 'Enter' && selectVideo(video)}
                    >
                      <div className="flex flex-col md:flex-row gap-4">
                        {video.thumbnailUrl && (
                          <div className="flex-shrink-0">
                            <img 
                              src={video.thumbnailUrl} 
                              alt="" 
                              className="w-32 h-auto rounded-lg"
                              aria-hidden="true" 
                            />
                          </div>
                        )}
                        <div>
                          <h3 className="text-xl font-semibold text-indigo-600">{video.title}</h3>
                          <p className="text-gray-700 mb-1">{video.channelTitle}</p>
                          <p className="text-gray-600">{video.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
            
            {selectedVideo && summary && (
              <section className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">Video Summary</h2>
                  <button
                    onClick={() => {
                      setSelectedVideo(null);
                      setSummary('');
                      stopAudio();
                    }}
                    className="text-indigo-600 hover:text-indigo-800"
                    aria-label="Back to search results"
                  >
                    Back to results
                  </button>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-indigo-600 mb-1">{selectedVideo.title}</h3>
                  <p className="text-gray-700">{selectedVideo.channelTitle}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h4 className="font-medium text-gray-800 mb-2">Summary:</h4>
                  <p className="text-gray-700 whitespace-pre-line">{summary}</p>
                </div>
                
                <div className="flex gap-4">
                  {audioPlaying ? (
                    <button
                      onClick={stopAudio}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                      aria-label="Stop audio playback"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z M10 10l4 4m0-4l-4 4" />
                      </svg>
                      Stop Audio
                    </button>
                  ) : (
                    <button
                      onClick={replayAudio}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                      aria-label="Play audio summary"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Play Summary
                    </button>
                  )}
                </div>
              </section>
            )}
          </>
        )}
        
        <section className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-2">How to Use This Tool</h2>
          <ol className="list-decimal pl-5 space-y-2 text-gray-700">
            <li>Press the Space key or click the "Start Voice Search" button to start listening</li>
            <li>Speak your search query clearly, then press Space again or click the button to search</li>
            <li>If voice search doesn't work, you can type your query and press search</li>
            <li>Browse through the search results and select a video to get its summary</li>
            <li>Listen to the summarized content automatically, or replay it as needed</li>
          </ol>
        </section>
      </div>
    </div>
  );
};

export default VoiceSearchAudioSummarizer;