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
  promptComponent?: React.ReactNode;
}

export default function Input({ 
  onSubmit, 
  commands, 
  commandHistory,
  onHistoryUp,
  onHistoryDown,
  disabled = false,
  promptComponent
}: InputProps) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);

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

  // Calculate cursor position
  const getCursorPosition = useCallback(() => {
    // Approximate character width for monospace font
    const charWidth = 8.4;
    return inputValue.length * charWidth;
  }, [inputValue]);

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
        {/* Prompt */}
        {promptComponent || <Prompt />}
        
        {/* Input container */}
        <div className="flex-1 relative flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            className="w-full bg-transparent text-[var(--text-primary)] caret-transparent focus:outline-none py-1 font-mono"
            placeholder=""
            aria-label="Terminal input"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck="false"
          />
          
          {/* Custom glowing cursor */}
          <span 
            ref={cursorRef}
            className="absolute top-1/2 -translate-y-1/2 inline-block w-[8px] h-[18px] bg-[var(--starship-green)] cursor-blink cursor-glow pointer-events-none rounded-sm"
            style={{ 
              left: `${getCursorPosition()}px`,
            }}
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Autocomplete suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="autocomplete-dropdown absolute left-0 top-full mt-2 py-1 z-10 min-w-[220px]">
          <div className="px-2 py-1 text-xs text-[var(--text-muted)] border-b border-[var(--terminal-border)] mb-1">
            Suggestions
          </div>
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion}
              className={`autocomplete-item px-3 py-1.5 cursor-pointer flex items-center gap-2 ${
                index === selectedSuggestion 
                  ? 'selected text-[var(--text-primary)]' 
                  : 'text-[var(--text-secondary)]'
              }`}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <span className="text-[var(--starship-cyan)] text-xs">›</span>
              <span>{suggestion}</span>
              {index === selectedSuggestion && (
                <span className="ml-auto text-xs text-[var(--text-muted)]">Tab ↹</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
