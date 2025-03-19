import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import 'regenerator-runtime/runtime';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Mic, MicOff, Book, Video, MessageSquare, Users, Brain, FileText, Volume2, VolumeX, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Code2 } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import DevTools from './DevTools';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
import logo from "../../../assets/logo.png";

function Blind() {
  const [activeSection, setActiveSection] = useState('home');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [pdfText, setPdfText] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const speechSynthesis = window.speechSynthesis;
  const utteranceRef = useRef(null);

  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/aitutor'); // Navigate to the Developer page
  };
  
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const speakText = (text) => {
    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    utteranceRef.current = new SpeechSynthesisUtterance(text);
    utteranceRef.current.rate = 0.9;
    utteranceRef.current.pitch = 1;
    utteranceRef.current.onend = () => setIsSpeaking(false);

    setIsSpeaking(true);
    speechSynthesis.speak(utteranceRef.current);
  };

  const extractTextFromPdf = async (file) => {
    try {
      setIsLoading(true);
      setError(null);
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n\n';
      }

      setPdfText(fullText);
      setIsLoading(false);
      return fullText;
    } catch (error) {
      console.error('Error extracting text:', error);
      setError('Failed to extract text from PDF.');
      setIsLoading(false);
      return '';
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      await extractTextFromPdf(file);
    } else {
      setError('Please select a valid PDF file.');
    }
  };

  const nextPage = () => {
    setPageNumber(prev => Math.min(prev + 1, numPages || 1));
  };

  const previousPage = () => {
    setPageNumber(prev => Math.max(prev - 1, 1));
  };

  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 2.0));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.6));
  };

  useEffect(() => {
    const voiceCommands = {
      'go to learning': () => setActiveSection('learning'),
      'go to videos': () => setActiveSection('videos'),
      'go to community': () => setActiveSection('community'),
      'go to resources': () => setActiveSection('resources'),
      'go to reader': () => setActiveSection('reader'),
      'go home': () => setActiveSection('home'),
      'read page': () => {
        const mainContent = document.querySelector('main').textContent;
        speakText(mainContent);
      },
      'stop reading': () => {
        speechSynthesis.cancel();
        setIsSpeaking(false);
      },
      'next page': () => nextPage(),
      'previous page': () => previousPage(),
      'zoom in': () => zoomIn(),
      'zoom out': () => zoomOut()
    };

    const checkCommand = () => {
      const command = transcript.toLowerCase();
      Object.entries(voiceCommands).forEach(([key, action]) => {
        if (command.includes(key)) {
          action();
          resetTranscript();
        }
      });
    };

    checkCommand();
  }, [transcript]);

  if (!browserSupportsSpeechRecognition) {
    return <div>Browser doesn't support speech recognition.</div>;
  }

  const toggleListening = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  const sections = {
    home: {
      title: "Welcome to DeafTech Education Hub",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Interactive Learning</h3>
            <p>Engage with our cutting-edge educational tools designed specifically for deaf and hard-of-hearing students.</p>
            <button
              onClick={() => speakText("Welcome to DeafTech Education Hub. This is an interactive learning platform.")}
              className="mt-4 flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              {isSpeaking ? <VolumeX className="mr-2" /> : <Volume2 className="mr-2" />}
              {isSpeaking ? 'Stop Reading' : 'Read Aloud'}
            </button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Voice Navigation</h3>
            <p>Experience seamless navigation with our voice command feature. Try saying "go to learning" or "read page"!</p>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li>• "go to [section]" - Navigate to any section</li>
              <li>• "read page" - Read current page content</li>
              <li>• "stop reading" - Stop text-to-speech</li>
              <li>• "next page" / "previous page" - Navigate PDF pages</li>
              <li>• "zoom in" / "zoom out" - Adjust PDF size</li>
            </ul>
          </div>
        </div>
      )
    },
    learning: {
      title: "Interactive Learning Materials",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['Sign Language Basics', 'Mathematics', 'Science'].map((subject) => (
            <div key={subject} className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-bold mb-3">{subject}</h3>
              <p>Interactive lessons with visual aids and captioned content.</p>
              <button
                onClick={() => speakText(`${subject} section contains interactive lessons with visual aids and captioned content.`)}
                className="mt-4 flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                {isSpeaking ? <VolumeX className="mr-2" /> : <Volume2 className="mr-2" />}
                Read Description
              </button>
            </div>
          ))}
        </div>
      )
    },
    videos: {
      title: "Educational Videos",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800"
              alt="Educational Video Thumbnail"
              className="w-full h-48 object-cover rounded mb-4"
            />
            <h3 className="text-lg font-bold">Sign Language Stories</h3>
            <button
              onClick={() => speakText("Sign Language Stories section featuring visual storytelling and sign language instruction.")}
              className="mt-4 flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              <Volume2 className="mr-2" />
              Read Description
            </button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1591291621164-2c6367723315?auto=format&fit=crop&w=800"
              alt="Educational Video Thumbnail"
              className="w-full h-48 object-cover rounded mb-4"
            />
            <h3 className="text-lg font-bold">Visual Learning Series</h3>
            <button
              onClick={() => speakText("Visual Learning Series with comprehensive educational content and interactive exercises.")}
              className="mt-4 flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              <Volume2 className="mr-2" />
              Read Description
            </button>
          </div>
        </div>
      )
    },
    community: {
      title: "Community Hub",
      content: (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-4">Connect with Others</h3>
          <p>Join our vibrant community of learners, educators, and supporters.</p>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="bg-blue-500 text-white p-3 rounded-lg">Join Discussion</button>
            <button className="bg-green-500 text-white p-3 rounded-lg">Share Resources</button>
          </div>
          <button
            onClick={() => speakText("Welcome to our Community Hub. Join our vibrant community of learners, educators, and supporters. You can participate in discussions and share resources.")}
            className="mt-4 flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            {isSpeaking ? <VolumeX className="mr-2" /> : <Volume2 className="mr-2" />}
            Read Description
          </button>
        </div>
      )
    },
    resources: {
      title: "Learning Resources",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-3">Downloads</h3>
            <ul className="space-y-2">
              <li>📚 Study Materials</li>
              <li>🎯 Practice Exercises</li>
              <li>📝 Worksheets</li>
            </ul>
            <button
              onClick={() => speakText("Downloads section includes study materials, practice exercises, and worksheets.")}
              className="mt-4 flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              <Volume2 className="mr-2" />
              Read List
            </button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-3">Tools</h3>
            <ul className="space-y-2">
              <li>🔍 Visual Dictionary</li>
              <li>✍️ Interactive Exercises</li>
              <li>📱 Mobile Apps</li>
            </ul>
            <button
              onClick={() => speakText("Tools available include Visual Dictionary, Interactive Exercises, and Mobile Apps.")}
              className="mt-4 flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              <Volume2 className="mr-2" />
              Read List
            </button>
          </div>
        </div>
      )
    },
    reader: {
      title: "PDF Reader",
      content: (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-4">Upload and Read PDF</h3>
          <div className="mb-6">
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              aria-label="Upload PDF file"
            />
          </div>
          {isLoading && (
            <div className="text-center py-4">
              <p className="text-blue-600">Extracting text from PDF...</p>
            </div>
          )}
          {error && (
            <div className="text-center py-4 text-red-600">
              <p>{error}</p>
            </div>
          )}
          {pdfFile && (
            <div className="mt-4">
              <Document
                file={pdfFile}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                onLoadError={(error) => setError('Failed to load PDF.')}
                className="border rounded-lg p-4"
              >
                <Page
                  pageNumber={pageNumber}
                  scale={scale}
                  className="mx-auto"
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                />
              </Document>
              <div className="flex justify-between items-center mt-4">
                <div className="flex space-x-2">
                  <button
                    onClick={previousPage}
                    disabled={pageNumber <= 1}
                    className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <span className="px-4 py-2">
                    Page {pageNumber} of {numPages}
                  </span>
                  <button
                    onClick={nextPage}
                    disabled={pageNumber >= numPages}
                    className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                    aria-label="Next page"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={zoomOut}
                    className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                    aria-label="Zoom out"
                  >
                    <ZoomOut className="h-5 w-5" />
                  </button>
                  <button
                    onClick={zoomIn}
                    className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                    aria-label="Zoom in"
                  >
                    <ZoomIn className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <button
                onClick={() => speakText(pdfText)}
                className="mt-4 flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 w-full justify-center"
                aria-label={isSpeaking ? 'Stop reading PDF' : 'Read PDF content'}
              >
                {isSpeaking ? <VolumeX className="mr-2" /> : <Volume2 className="mr-2" />}
                {isSpeaking ? 'Stop Reading' : 'Read PDF'}
              </button>
            </div>
          )}
        </div>
      )
    },
    developer: {
      title: "Developer Tools",
      content: (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Developer Console</h3>
            <p className="mb-4">Access speech recognition debugging tools and implementation examples.</p>
            <DevTools />
          </div>
        </div>
      )
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8">
              <div className="flex-shrink-0 flex items-center">
                <img src={logo} alt="ShikshaSoladu Logo" className="h-8 w-8" />
                <span className="ml-2 text-xl font-bold">ShikshaSoladu.ai</span>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                <button onClick={() => setActiveSection('learning')} className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100">
                  <Book className="h-5 w-5 mr-1" />
                  Learning
                </button>
                <button onClick={() => setActiveSection('videos')} className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100">
                  <Video className="h-5 w-5 mr-1" />
                  Videos
                </button>
                <button onClick={() => setActiveSection('community')} className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100">
                  <Users className="h-5 w-5 mr-1" />
                  Community
                </button>
                <button onClick={() => setActiveSection('resources')} className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100">
                  <MessageSquare className="h-5 w-5 mr-1" />
                  Resources
                </button>
                <button onClick={() => setActiveSection('reader')} className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100">
                  <FileText className="h-5 w-5 mr-1" />
                  PDF Reader
                </button>
                <button onClick={handleClick} className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100">
                  <Code2 className="h-5 w-5 mr-1" />AI Tutor
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => speakText(document.querySelector('main').textContent)}
                className={`p-2 rounded-full ${isSpeaking ? 'bg-red-100' : 'bg-blue-100'}`}
                title={isSpeaking ? 'Stop reading' : 'Read page content'}
                aria-label={isSpeaking ? 'Stop reading' : 'Read page content'}
              >
                {isSpeaking ? <VolumeX className="h-6 w-6 text-red-500" /> : <Volume2 className="h-6 w-6 text-blue-500" />}
              </button>
              <button
                onClick={toggleListening}
                className={`p-2 rounded-full ${listening ? 'bg-red-100' : 'bg-gray-100'}`}
                title={listening ? 'Stop voice commands' : 'Start voice commands'}
                aria-label={listening ? 'Stop voice commands' : 'Start voice commands'}
              >
                {listening ? <Mic className="h-6 w-6 text-red-500" /> : <MicOff className="h-6 w-6 text-gray-500" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{sections[activeSection].title}</h1>
          {listening && (
            <div className="bg-blue-50 p-3 rounded-lg mb-4">
              <p className="text-sm text-blue-700">🎤 Listening for voice commands... "{transcript}"</p>
            </div>
          )}
        </div>
        {sections[activeSection].content}
      </main>
    </div>
  );
}

export default Blind;