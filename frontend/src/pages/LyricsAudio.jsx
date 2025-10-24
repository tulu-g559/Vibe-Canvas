import React, { useState } from "react";
import { generateLyricsAudio } from "../api";
import Card from "../components/Card";
import StyledDropdown from "../components/StyledDropdown";

export default function LyricsAudio() {
  const [prompt, setPrompt] = useState("");
  const [mood, setMood] = useState("neutral");
  const [lyrics, setLyrics] = useState("");
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerateAudio = async () => {
    if (!prompt.trim() && !lyrics.trim()) {
      setError("⚠️ Please enter a prompt or lyrics to generate audio.");
      return;
    }

    setError("");
    setLoading(true);
    setAudioUrl(null);
    try {
      console.log(mood);
      const blob = await generateLyricsAudio(prompt, mood, lyrics);
      setAudioUrl(URL.createObjectURL(blob));
    } catch (err) {
      setError("❌ Failed to generate audio. Please try again.");
      console.log(err.message);
    }
    setLoading(false);
  };

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
    if (error && e.target.value.trim()) setError("");
  };

  const handleLyricsChange = (e) => {
    setLyrics(e.target.value);
    if (error && e.target.value.trim()) setError("");
  };

  const handleMoodChange = (selectedMood) => {
    setMood(selectedMood);
    if (error && selectedMood.trim()) setError("");
  };

  return (
    <div
      className="w-full min-h-screen flex flex-col items-center justify-start 
      bg-linear-to-b from-yellow-200 via-orange-200 to-pink-200 
      dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 
      transition-colors duration-500 pt-16 pb-8 px-4 sm:px-6 md:px-12"
    >
      <Card
        title="Convert Lyrics to Audio"
        className="w-full max-w-xl sm:max-w-2xl md:max-w-4xl"
      >
        <textarea
          placeholder="Enter lyrics (optional)..."
          className="w-full p-3 mb-4 border border-gray-300 dark:border-gray-700 
            rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 
            bg-white/90 dark:bg-gray-900/60 shadow-sm text-sm sm:text-base 
            text-gray-800 dark:text-gray-100 transition"
          value={lyrics}
          onChange={handleLyricsChange}
        />
        <input
          type="text"
          placeholder="Prompt (used if lyrics empty)"
          className="w-full p-3 mb-4 border border-gray-300 dark:border-gray-700 
            rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 
            bg-white/90 dark:bg-gray-900/60 shadow-sm text-sm sm:text-base 
            text-gray-800 dark:text-gray-100 transition"
          value={prompt}
          onChange={handlePromptChange}
        />
        <StyledDropdown
          label="Mood"
          value={mood}
          onChange={handleMoodChange}
          options={["Neutral", "Happy", "Sad", "Angry", "Romantic"]}
        />

        {error && (
          <p className="text-red-500 text-xs sm:text-sm mb-4 text-center font-medium animate-fade-in-up">
            {error}
          </p>
        )}

        <button
          onClick={handleGenerateAudio}
          className="w-full bg-linear-to-r from-orange-300 via-yellow-300 to-pink-300 
            dark:from-purple-700 dark:via-pink-700 dark:to-red-700 
            text-gray-800 dark:text-gray-100 p-3 rounded-lg font-semibold 
            hover:scale-105 transition text-sm sm:text-base"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Audio"}
        </button>

        {audioUrl && (
          <audio
            controls
            className="mt-4 w-full rounded-4xl shadow-xl dark:shadow-gray-900"
            src={audioUrl}
          />
        )}
      </Card>
    </div>
  );
}
