import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import GenerateImage from "./pages/GenerateImage.jsx";
import GenerateLyrics from "./pages/GenerateLyrics.jsx";
import LyricsAudio from "./pages/LyricsAudio.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/generate-image" element={<GenerateImage />} />
          <Route path="/generate-poetry" element={<GenerateLyrics />} />
          <Route path="/lyrics-audio" element={<LyricsAudio />} />
        </Routes>
    </div>
  );
}
