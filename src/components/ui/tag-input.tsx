"use client";

import React, { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function TagInput({ value = [], onChange, placeholder, disabled }: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (e.key === "Enter" || e.key === "," || e.key === " ") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      // Remove last tag if input is empty
      const newTags = [...value];
      newTags.pop();
      onChange(newTags);
    }
  };

  const addTag = () => {
    const trimmed = inputValue.trim().replace(/,/g, "");
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
      setInputValue("");
    }
  };

  const removeTag = (index: number) => {
    if (disabled) return;
    const newTags = value.filter((_, i) => i !== index);
    onChange(newTags);
  };

  // Blur event or focus out could also trigger add
  const handleBlur = () => {
    addTag();
  };

  return (
    <div 
      className={`flex flex-wrap items-center gap-2 p-2 border-2 border-black rounded-xl bg-white min-h-[3rem] ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-text"}`}
      onClick={() => inputRef.current?.focus()}
    >
      {value.map((tag, index) => (
        <span 
          key={index} 
          className="bg-yellow-100 border-2 border-black px-2 py-1 rounded-lg text-xs font-black flex items-center gap-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        >
          {tag}
          {!disabled && (
            <button 
              type="button"
              onClick={(e) => { e.stopPropagation(); removeTag(index); }}
              className="hover:text-red-500"
            >
              <X className="h-3 w-3 stroke-[3]" />
            </button>
          )}
        </span>
      ))}
      
      <input
        ref={inputRef}
        type="text"
        className="flex-grow min-w-[120px] outline-none bg-transparent text-sm font-bold placeholder:font-normal"
        placeholder={value.length === 0 ? placeholder : ""}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        disabled={disabled}
      />
    </div>
  );
}
