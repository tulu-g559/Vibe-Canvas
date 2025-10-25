import React from "react";

export default function Card({ title, children, className = "" }) {
  return (
    <div
      className={`p-6 sm:p-8 rounded-2xl shadow-lg 
      bg-white/90 dark:bg-gray-900/70 
      text-gray-800 dark:text-gray-100 
      backdrop-blur-md transition-all duration-500 ${className}`}
    >
      {title && (
        <h2
          className="text-2xl sm:text-3xl font-bold mb-6 text-center 
        text-gray-900 dark:text-white transition-colors duration-500"
        >
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}
