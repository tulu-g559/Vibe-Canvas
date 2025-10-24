import React, { useState } from "react";
import Card from "../components/Card";
import { generateImage } from "../api";

export default function GenerateImage() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("⚠️ Please enter a prompt before generating an image.");
      return;
    }

    setError("");
    setLoading(true);
    setImageUrl(null);
    try {
      const blob = await generateImage(prompt);
      setImageUrl(URL.createObjectURL(blob));
    } catch (err) {
      setError("❌ Failed to generate image. Please try again.");
      console.error(err);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setPrompt(e.target.value);
    if (error && e.target.value.trim()) setError("");
  };

  return (
    <div
      className="w-full min-h-screen flex flex-col items-center justify-start transition-colors duration-500
      bg-linear-to-b from-purple-200 via-blue-200 to-indigo-200
      dark:from-gray-900 dark:via-gray-800 dark:to-gray-900
      pt-16 pb-8 px-4 sm:px-6 md:px-12"
    >
      <Card
        title="Generate AI Images"
        className="w-full max-w-xl sm:max-w-2xl md:max-w-4xl bg-white/90 dark:bg-gray-900/70 text-gray-800 dark:text-gray-100 transition-all"
      >
        <input
          type="text"
          placeholder="Describe your image..."
          className="w-full p-3 mb-4 border border-gray-300 dark:border-gray-700 rounded-xl 
          focus:outline-none focus:ring-2 focus:ring-pink-400 
          bg-white/90 dark:bg-gray-800 shadow-sm text-sm sm:text-base text-gray-900 dark:text-gray-100 transition"
          value={prompt}
          onChange={handleChange}
        />

        {error && (
          <p className="text-red-500 text-xs sm:text-sm mb-4 text-center font-medium animate-fade-in-up">
            {error}
          </p>
        )}

        <button
          onClick={handleGenerate}
          className="w-full bg-linear-to-r from-blue-300 via-purple-300 to-pink-300 
          dark:from-indigo-700 dark:via-purple-700 dark:to-pink-700
          text-gray-800 dark:text-white p-3 rounded-lg font-semibold 
          hover:scale-105 transition text-sm sm:text-base"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Image"}
        </button>

        {imageUrl && (
          <img
            src={imageUrl}
            alt="AI generated"
            className="mt-6 w-full rounded-2xl shadow-xl border border-white/20 
            object-contain dark:border-gray-700"
          />
        )}
      </Card>
    </div>
  );
}
