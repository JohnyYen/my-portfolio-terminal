'use client';

import React, { useEffect, useState, useRef } from 'react';

interface OutputLine {
  type: 'stdout' | 'stderr' | 'stdin' | 'info';
  content: string;
  timestamp: number;
}

interface OutputProps {
  lines: OutputLine[];
  typingSpeed?: number;
}

export default function Output({ lines, typingSpeed = 10 }: OutputProps) {
  const [displayedLines, setDisplayedLines] = useState<OutputLine[]>([]);
  const [currentTyping, setCurrentTyping] = useState<{ lineIndex: number; charIndex: number } | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  // Handle typing animation for new lines
  useEffect(() => {
    if (lines.length === 0) return;

    const lastLine = lines[lines.length - 1];
    const lastDisplayedLine = displayedLines[displayedLines.length - 1];

    // If this is a new line that hasn't been displayed yet
    if (!lastDisplayedLine || lastLine.timestamp !== lastDisplayedLine.timestamp) {
      setCurrentTyping({ lineIndex: lines.length - 1, charIndex: 0 });
    }
  }, [lines, displayedLines]);

  // Typing animation
  useEffect(() => {
    if (!currentTyping) return;

    const { lineIndex, charIndex } = currentTyping;
    const line = lines[lineIndex];

    if (!line) return;

    if (charIndex < line.content.length) {
      const timeout = setTimeout(() => {
        setCurrentTyping({ lineIndex, charIndex: charIndex + 1 });
        
        // Update displayed lines
        const newDisplayedLines = [...displayedLines];
        if (newDisplayedLines[lineIndex]) {
          newDisplayedLines[lineIndex] = {
            ...line,
            content: line.content.substring(0, charIndex + 1)
          };
        } else {
          newDisplayedLines[lineIndex] = {
            ...line,
            content: line.content.substring(0, charIndex + 1)
          };
        }
        setDisplayedLines(newDisplayedLines);
      }, typingSpeed);

      return () => clearTimeout(timeout);
    } else {
      // Line is complete
      setCurrentTyping(null);
    }
  }, [currentTyping, lines, displayedLines, typingSpeed]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [displayedLines]);

  // Initialize with all completed lines
  useEffect(() => {
    if (!currentTyping && lines.length > displayedLines.length) {
      setDisplayedLines(lines);
    }
  }, [lines, currentTyping, displayedLines.length]);

  const getLineClass = (type: OutputLine['type']) => {
    switch (type) {
      case 'stderr':
        return 'text-[#ff5555]';
      case 'stdin':
        return 'text-[#f8f8f8] font-bold';
      case 'info':
        return 'text-[#ffb000]';
      case 'stdout':
      default:
        return 'text-[#00ff00]';
    }
  };

  return (
    <div 
      ref={outputRef}
      className="flex-1 overflow-y-auto py-2 terminal-selectable"
      role="log"
      aria-live="polite"
      aria-label="Terminal output"
    >
      {displayedLines.map((line, index) => (
        <div 
          key={`${line.timestamp}-${index}`}
          className={`${getLineClass(line.type)} whitespace-pre-wrap break-words`}
        >
          {line.content}
        </div>
      ))}
      
      {/* Typing indicator */}
      {currentTyping && (
        <div className="inline-flex items-center">
          <span className={`text-[#00ff00]`}>
            {lines[currentTyping.lineIndex]?.content.substring(0, currentTyping.charIndex)}
          </span>
          <span className="inline-block w-[8px] h-[16px] bg-[#00ff00] cursor-blink ml-[1px]" />
        </div>
      )}
    </div>
  );
}
