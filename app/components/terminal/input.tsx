'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Prompt from './prompt';

interface InputProps {
  onSubmit: (command: string) => void;
  commands: string[];
  commandHistory: string[];
  onHistoryUp: () => string | null;
  onHistoryDown: () => string | null;
  disabled?: boolean;
}

export default function Input({ 
  onSubmit, 
  commands, 
  commandHistory,
  onHistoryUp,
  onHistoryDown,
  disabled = false 
}: InputProps) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update suggestions based on input
  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = commands.filter(cmd => 
        cmd.toLowerCase().startsWith(inputValue.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
      setSelectedSuggestion(0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [inputValue, commands]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    switch (e.key) {
      case 'Tab':
        e.preventDefault();
        if (suggestions.length > 0) {
          setInputValue(suggestions[selectedSuggestion]);
          setShowSuggestions(false);
        }
        break;

      case 'Enter':
        e.preventDefault();
        if (inputValue.trim()) {
          onSubmit(inputValue.trim());
          setInputValue('');
          setShowSuggestions(false);
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (showSuggestions) {
          setSelectedSuggestion(prev => 
            prev > 0 ? prev - 1 : suggestions.length - 1
          );
        } else {
          const prevCommand = onHistoryUp();
          if (prevCommand !== null) {
            setInputValue(prevCommand);
          }
        }
        break;

      case 'ArrowDown':
        e.preventDefault();
        if (showSuggestions) {
          setSelectedSuggestion(prev => 
            prev < suggestions.length - 1 ? prev + 1 : 0
          );
        } else {
          const nextCommand = onHistoryDown();
          if (nextCommand !== null) {
            setInputValue(nextCommand);
          }
        }
        break;

      case 'Escape':
        setShowSuggestions(false);
        break;
    }
  }, [disabled, suggestions, selectedSuggestion, inputValue, onSubmit, onHistoryUp, onHistoryDown, showSuggestions]);

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div className="relative">
      <div className="flex items-center">
        <Prompt />
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            className="w-full bg-transparent text-[#00ff00] caret-transparent focus:outline-none"
            placeholder=""
            aria-label="Terminal input"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck="false"
          />
          
          {/* Custom cursor */}
          <span 
            className="absolute top-0 inline-block w-[10px] h-[20px] bg-[#00ff00] cursor-blink pointer-events-none"
            style={{ 
              left: `${inputValue.length * 0.6}em`,
            }}
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Autocomplete suggestions */}
      {showSuggestions && (
        <div className="absolute left-0 top-full mt-1 bg-[#1e1e1e] border border-[#333] rounded shadow-lg z-10 min-w-[200px]">
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion}
              className={`px-3 py-2 cursor-pointer ${
                index === selectedSuggestion 
                  ? 'bg-[#094771] text-[#fff]' 
                  : 'text-[#cccccc] hover:bg-[#2a2d2e]'
              }`}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
