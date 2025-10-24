import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div
      className="w-full min-h-screen flex flex-col items-center justify-center relative px-4 py-12 sm:px-6 md:px-12
      bg-linear-to-br from-pink-200 via-purple-200 to-blue-200
      dark:from-gray-800 dark:via-gray-900 dark:to-gray-700
      transition-colors duration-500"
    >
      <div
        className="absolute top-0 left-0 w-full h-full opacity-50
        bg-linear-to-br from-pink-200 via-purple-200 to-blue-200
        dark:from-gray-800 dark:via-gray-900 dark:to-gray-700
      "
      ></div>

      <div className="relative z-10 text-center max-w-5xl w-full">
        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6
          text-gray-800 dark:text-gray-100
        "
        >
          Welcome to{" "}
          <span className="text-pink-500 dark:text-pink-400">Vibe Canvas</span>
        </h1>
        <p
          className="text-base sm:text-lg md:text-xl mb-12
          text-gray-700 dark:text-gray-300
        "
        >
          Unleash your creativity with AI-generated images, lyrics, and audio.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          <Link
            to="/generate-image"
            className="block rounded-2xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition transform hover:-translate-y-1
              bg-linear-to-r from-blue-200 via-purple-200 to-pink-200
              dark:from-gray-700 dark:via-gray-800 dark:to-gray-900
            "
          >
            <h2
              className="text-xl sm:text-2xl font-bold mb-2
              text-gray-800 dark:text-gray-100
            "
            >
              Generate Image
            </h2>
            <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
              Create stunning AI-generated images from your prompts.
            </p>
          </Link>

          <Link
            to="/generate-poetry"
            className="block rounded-2xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition transform hover:-translate-y-1
              bg-linear-to-r from-green-200 via-teal-200 to-cyan-200
              dark:from-gray-700 dark:via-gray-800 dark:to-gray-900
            "
          >
            <h2
              className="text-xl sm:text-2xl font-bold mb-2
              text-gray-800 dark:text-gray-100
            "
            >
              Generate Poetry
            </h2>
            <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
              Generate creative poetry based on your ideas.
            </p>
          </Link>

          <Link
            to="/lyrics-audio"
            className="block rounded-2xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition transform hover:-translate-y-1
              bg-linear-to-r from-yellow-200 via-orange-200 to-pink-200
              dark:from-gray-700 dark:via-gray-800 dark:to-gray-900
            "
          >
            <h2
              className="text-xl sm:text-2xl font-bold mb-2
              text-gray-800 dark:text-gray-100
            "
            >
              Lyrics to Audio
            </h2>
            <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
              Convert lyrics into audio with realistic AI-generated voices.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
