import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const [height, setHeight] = useState(0);
  const [darkMode, setDarkMode] = useState(() => {
    // Read saved preference from localStorage or default to system preference
    const storedMode = localStorage.getItem("theme");
    if (storedMode) return storedMode === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Animate dropdown height
  useEffect(() => {
    if (menuRef.current) {
      setHeight(isOpen ? menuRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  // Apply dark mode to <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <nav
      className={`sticky top-0 z-50 shadow-lg transition-colors duration-500 ${
        darkMode
          ? "bg-linear-to-r from-gray-900 via-indigo-950 to-gray-800 text-white"
          : "bg-linear-to-r from-pink-500 via-purple-500 to-indigo-500 text-white"
      }`}
    >
      <div className="max-w-6xl mx-auto flex justify-between items-center px-4 py-3 md:py-4">
        {/* Logo Text only */}
        <h1 className="text-xl font-extrabold tracking-wide">Vibe Canvas</h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link className="hover:text-yellow-300 font-medium transition" to="/">
            Home
          </Link>
          <Link
            className="hover:text-yellow-300 font-medium transition"
            to="/generate-image"
          >
            Image
          </Link>
          <Link
            className="hover:text-yellow-300 font-medium transition"
            to="/generate-lyrics"
          >
            Lyrics
          </Link>
          <Link
            className="hover:text-yellow-300 font-medium transition"
            to="/lyrics-audio"
          >
            Audio
          </Link>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="ml-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? (
              // 🌙 Moon icon (Dark Mode)
              <svg
                className="w-6 h-6 text-yellow-300"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M21.64 13.04A9 9 0 0111 2a9 9 0 000 18 9 9 0 0010.64-6.96z" />
              </svg>
            ) : (
              // 🌞 Sun icon (Light Mode)
              <svg
                className="w-6 h-6 text-yellow-100"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 4.354a7.646 7.646 0 110 15.292 7.646 7.646 0 010-15.292zM12 2a1 1 0 011 1v1.09a1 1 0 11-2 0V3a1 1 0 011-1zm0 18a1 1 0 011 1v1.09a1 1 0 11-2 0V21a1 1 0 011-1zm10-9a1 1 0 01-1 1h-1.09a1 1 0 110-2H21a1 1 0 011 1zM4 12a1 1 0 01-1 1H1.91a1 1 0 110-2H3a1 1 0 011 1z" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Controls */}
        <div className="md:hidden flex items-center space-x-3">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? (
              <svg
                className="w-6 h-6 text-yellow-300"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M21.64 13.04A9 9 0 0111 2a9 9 0 000 18 9 9 0 0010.64-6.96z" />
              </svg>
            ) : (
              <svg
                className="w-6 h-6 text-yellow-100"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 4.354a7.646 7.646 0 110 15.292 7.646 7.646 0 010-15.292zM12 2a1 1 0 011 1v1.09a1 1 0 11-2 0V3a1 1 0 011-1zm0 18a1 1 0 011 1v1.09a1 1 0 11-2 0V21a1 1 0 011-1zm10-9a1 1 0 01-1 1h-1.09a1 1 0 110-2H21a1 1 0 011 1zM4 12a1 1 0 01-1 1H1.91a1 1 0 110-2H3a1 1 0 011 1z" />
              </svg>
            )}
          </button>

          {/* Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="focus:outline-none"
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <div
        ref={menuRef}
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "mt-2" : "mt-0"
        }`}
        style={{ height: `${height}px` }}
      >
        <div className="flex flex-col space-y-2 px-4 pb-3 text-white">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="hover:text-yellow-300 transition"
          >
            Home
          </Link>
          <Link
            to="/generate-image"
            onClick={() => setIsOpen(false)}
            className="hover:text-yellow-300 transition"
          >
            Image
          </Link>
          <Link
            to="/generate-lyrics"
            onClick={() => setIsOpen(false)}
            className="hover:text-yellow-300 transition"
          >
            Lyrics
          </Link>
          <Link
            to="/lyrics-audio"
            onClick={() => setIsOpen(false)}
            className="hover:text-yellow-300 transition"
          >
            Audio
          </Link>
        </div>
      </div>
    </nav>
  );
}
