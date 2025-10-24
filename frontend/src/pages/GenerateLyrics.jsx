import React, { useState } from "react";
import { generateLyrics } from "../api";
import Card from "../components/Card";
import StyledDropdown from "../components/StyledDropdown";

export default function GenerateLyrics() {
  const [prompt, setPrompt] = useState("");
  const [mood, setMood] = useState("neutral");
  const [lyrics, setLyrics] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!prompt.trim() || !mood.trim()) {
      setError(
        "⚠️ Please enter a prompt and select a mood before generating lyrics."
      );
      return;
    }

    setError("");
    setLoading(true);
    setLyrics("");
    setAudioUrl("");
    try {
      const res = await generateLyrics(prompt, mood);

      if (res.audio_base64) {
        const audioBytes = Uint8Array.from(atob(res.audio_base64), (c) =>
          c.charCodeAt(0)
        );
        const blob = new Blob([audioBytes], { type: "audio/mpeg" });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
      }

      setLyrics(res.lyrics);
    } catch (err) {
      setError("❌ Failed to generate lyrics. Please try again.");
      console.error(err.message);
    }
    setLoading(false);
  };

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
    if (error && e.target.value.trim()) setError("");
  };

  const handleMoodChange = (selectedMood) => {
    setMood(selectedMood);
    if (error && selectedMood.trim()) setError("");
  };

  return (
    <div
      className="w-full min-h-screen flex flex-col items-center justify-start 
      bg-linear-to-b from-teal-200 via-green-200 to-cyan-200 
      dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 
      pt-16 pb-8 px-4 sm:px-6 md:px-12 transition-colors duration-500"
    >
      <Card
        title="Generate Creative Poetry"
        className="w-full max-w-xl sm:max-w-2xl md:max-w-4xl 
        bg-white/90 dark:bg-gray-900/70 
        text-gray-800 dark:text-gray-100 transition-all"
      >
        <input
          type="text"
          placeholder="Enter a prompt..."
          className="w-full p-3 mb-4 border border-gray-300 dark:border-gray-700 
          rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 
          bg-white/90 dark:bg-gray-800 text-gray-900 dark:text-gray-100 
          shadow-sm text-sm sm:text-base transition"
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
          onClick={handleGenerate}
          className="w-full bg-linear-to-r from-green-300 via-teal-300 to-cyan-300 
          dark:from-teal-700 dark:via-green-700 dark:to-cyan-800 
          text-gray-800 dark:text-white p-3 rounded-lg font-semibold 
          hover:scale-105 transition text-sm sm:text-base"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Poetry"}
        </button>

        {audioUrl && (
          <audio controls src={audioUrl} className="w-full mt-4 rounded-lg" />
        )}

        {lyrics && (
          <pre
            className="mt-4 p-4 rounded-2xl text-gray-800 dark:text-gray-100 
            bg-white/20 dark:bg-gray-800/40 
            backdrop-blur-lg whitespace-pre-wrap text-sm sm:text-base transition"
          >
            {lyrics}
          </pre>
        )}
      </Card>
    </div>
  );
}
