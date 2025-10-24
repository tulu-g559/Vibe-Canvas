import React, { useState } from "react";

export default function StyledDropdown({ value, onChange, options, label }) {
  const [open, setOpen] = useState(false);

  const handleSelect = (opt) => {
    onChange(opt.toLowerCase());
    setOpen(false);
  };

  return (
    <div className="w-full relative mb-6">
      {label && (
        <label className="block mb-2 text-gray-700 dark:text-gray-300 font-semibold">
          {label}
        </label>
      )}

      <div
        onClick={() => setOpen(!open)}
        className={`p-3 w-full border rounded-xl shadow-sm cursor-pointer transition 
          ${open ? "ring-2 ring-pink-400 border-pink-400" : ""}
          bg-white/80 dark:bg-gray-900/60
          border-gray-300 dark:border-gray-700
          hover:border-pink-300 dark:hover:border-pink-500
        `}
      >
        <div className="flex justify-between items-center">
          <span className="text-gray-700 dark:text-gray-100 capitalize">
            {value || "Select mood"}
          </span>
          <svg
            className={`w-5 h-5 text-gray-500 dark:text-gray-300 transition-transform ${
              open ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {open && (
        <div
          className="absolute mt-2 w-full border rounded-xl shadow-lg z-10 overflow-hidden 
            bg-white/90 dark:bg-gray-800/95 backdrop-blur-md
            border-gray-200 dark:border-gray-700 animate-fade-in-up"
        >
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => handleSelect(opt)}
              className="px-4 py-2 capitalize cursor-pointer transition 
                text-gray-700 dark:text-gray-200
                hover:bg-pink-100 hover:text-pink-600
                dark:hover:bg-gray-700 dark:hover:text-pink-400"
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
