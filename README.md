# ShikshaSoladu.ai

ShikshaSoladu.ai is an inclusive education platform that provides AI-assisted learning tools for students with disabilities. The platform currently offers dedicated experiences for blind and visually impaired learners and for deaf and hard-of-hearing learners, with the broader goal of supporting dyslexic and other differently-abled learners as well.

![Group 1437253789](https://github.com/user-attachments/assets/91bc74bc-9637-4a2c-83d5-39ead6a296b6)

Live demo: https://sikhshasoladuai.vercel.app/

## Overview

Traditional e-learning platforms are largely built around sight and sound, which leaves a significant gap for learners who cannot rely on one of those senses. ShikshaSoladu.ai addresses this by building separate, purpose-built interfaces for each learner group instead of retrofitting a single generic UI with accessibility patches.

- For blind and visually impaired learners, the platform emphasizes audio, text-to-speech, and screen-reader-friendly interaction patterns.
- For deaf and hard-of-hearing learners, the platform emphasizes sign language recognition, visual cues, and captioning.

## Key Features

### For blind and visually impaired learners
- AI tutor for conversational, voice-driven learning support
- PDF reader with read-aloud support
- Video player with automatic subtitle generation
- YouTube video search and audio summarization
- Accessible code viewer for reading and navigating source code by voice/keyboard
- Developer tools module
- Voice-driven geography quiz game
- Dedicated authentication flow

### For deaf and hard-of-hearing learners
- Real-time sign language detection using webcam input (MediaPipe Hands and TensorFlow.js)
- Fingerspelling practice module
- Sign language dictionary and sign language translator
- Sign language video lessons and sentence-building games
- Visual learning module with curated YouTube content
- Visual aids, vibration alerts, and visual notifications as substitutes for audio cues
- Gamification: badges, leaderboard, and puzzle/sign-matching games
- Progress tracking with charts and a personal dashboard
- Community tools: forum, live chat, and polls
- Kanban board and calendar for planning study time
- Peer-to-peer video meetings (WebRTC)
- Dedicated authentication flow and profile page

## Tech Stack

**Frontend**
- React 19 with Vite
- React Router
- Tailwind CSS
- Framer Motion
- MediaPipe (Hands, Camera Utils, Drawing Utils) and TensorFlow.js (handpose, fingerpose) for gesture and sign recognition
- react-pdf / pdfjs-dist for PDF rendering
- react-speech-recognition for voice input
- chart.js and Recharts for progress visualization
- react-big-calendar and react-beautiful-dnd for planning tools
- socket.io-client, PeerJS, and WebRTC for real-time communication
- Axios for HTTP requests

**Backend**
- Node.js with Express
- MongoDB with Mongoose
- CORS and dotenv for configuration

## Project Structure

```
shikshasoladu.ai/
├── backend/
│   ├── server.js          # Express app entry point and MongoDB connection
│   └── package.json
└── frontend/
    ├── public/
    │   └── models/        # Pretrained models used for gesture/sign detection
    └── src/
        ├── App.jsx         # Route definitions
        ├── Layout.jsx
        ├── components/     # Shared components
        └── page/
            ├── Home.jsx    # Landing page
            ├── Alluser/    # Shared entry point for all users
            ├── Blind/      # Blind/visually impaired learner module
            └── Deaf/       # Deaf/hard-of-hearing learner module
```

## Getting Started

### Prerequisites
- Node.js (v18 or later recommended)
- npm
- A running MongoDB instance (local or hosted, e.g. MongoDB Atlas)

### Installation

Clone the repository:

```bash
git clone https://github.com/Axestein/shikshasoladu.ai.git
cd shikshasoladu.ai
```

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd ../frontend
npm install
```

### Environment Variables

Create a `.env` file inside the `backend` directory with the following variables:

```
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

The frontend integrates with external services such as the YouTube Data API and the Giphy API for certain features (video search, sign language GIFs, etc.). When configuring these for your own deployment, keys should be moved out of source files and into environment variables (for example, `VITE_YOUTUBE_API_KEY`, `VITE_GIPHY_API_KEY`) rather than hardcoded, and loaded via `import.meta.env` in Vite.

### Running the Application

Start the backend server:

```bash
cd backend
npm start
```

The backend runs on `http://localhost:5000` by default.

Start the frontend development server:

```bash
cd frontend
npm run dev
```

The frontend runs on the local Vite development server (typically `http://localhost:5173`).

### Building for Production

```bash
cd frontend
npm run build
```

This generates a production-ready build in `frontend/dist`, which is the build deployed to Vercel for the live demo.

## Roadmap

- Support for dyslexic learners
- Expanded backend API coverage (the backend currently exposes a minimal skeleton with a single health-check route)
- Migration of hardcoded third-party API keys to environment variables

## Contributing

Contributions are welcome. To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push to your branch and open a pull request

Please open an issue first for significant changes so they can be discussed before implementation.

## License

No license has been specified for this repository yet. If you intend to reuse this code, please contact the repository owner.

## Author

Developed by [Axestein](https://github.com/Axestein).
