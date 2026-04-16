'use client';

import React, { useEffect, useState, useRef } from 'react';

interface OutputLine {
  type: 'stdout' | 'stderr' | 'stdin' | 'info' | 'success' | 'warning';
  content: string;
  timestamp: number;
}

interface OutputProps {
  lines: OutputLine[];
  typingSpeed?: number;
}

export default function Output({ lines, typingSpeed = 4 }: OutputProps) {
  const [displayedLines, setDisplayedLines] = useState<OutputLine[]>([]);
  const [currentTyping, setCurrentTyping] = useState<{ lineIndex: number; charIndex: number } | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const lastProcessedIndex = useRef<number>(-1);

  // Sync displayedLines with lines when new lines are added
  useEffect(() => {
    if (lines.length === 0) {
      setDisplayedLines([]);
      lastProcessedIndex.current = -1;
      return;
    }

    // Initialize displayedLines if it's empty
    if (displayedLines.length === 0 && lines.length > 0) {
      setDisplayedLines([...lines]);
      lastProcessedIndex.current = lines.length - 1;
      return;
    }

    // Check if there are new lines to process
    const lastLineIndex = lines.length - 1;
    
    if (lastLineIndex > lastProcessedIndex.current) {
      // Add new line to displayedLines
      setDisplayedLines(prev => {
        const newLines = [...prev];
        // Fill in any gaps
        for (let i = prev.length; i <= lastLineIndex; i++) {
          if (!newLines[i]) {
            newLines[i] = lines[i];
          }
        }
        return newLines;
      });
      
      // Start typing animation for the new line
      setCurrentTyping({ lineIndex: lastLineIndex, charIndex: 0 });
    }
  }, [lines.length]);

  // Typing animation effect
  useEffect(() => {
    if (currentTyping === null) return;

    const { lineIndex, charIndex } = currentTyping;
    const line = lines[lineIndex];

    if (!line) {
      setCurrentTyping(null);
      return;
    }

    // Skip typing for empty lines
    if (line.content.length === 0) {
      setDisplayedLines(prev => {
        const newLines = [...prev];
        newLines[lineIndex] = { ...line, content: '' };
        return newLines;
      });
      lastProcessedIndex.current = lineIndex;
      setCurrentTyping(null);
      return;
    }

    // Continue typing
    if (charIndex < line.content.length) {
      const timeout = setTimeout(() => {
        setCurrentTyping({ lineIndex, charIndex: charIndex + 1 });
        
        setDisplayedLines(prev => {
          const newLines = [...prev];
          newLines[lineIndex] = {
            ...line,
            content: line.content.substring(0, charIndex + 1)
          };
          return newLines;
        });
      }, typingSpeed);

      return () => clearTimeout(timeout);
    } else {
      // Typing complete
      lastProcessedIndex.current = lineIndex;
      setCurrentTyping(null);
    }
  }, [currentTyping, lines, typingSpeed]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [displayedLines, currentTyping]);

  const getLineClass = (type?: string) => {
    switch (type) {
      case 'stderr':
        return 'output-stderr';
      case 'stdin':
        return 'output-stdin';
      case 'info':
        return 'output-info';
      case 'success':
        return 'output-success';
      case 'warning':
        return 'output-warning';
      default:
        return 'output-stdout';
    }
  };

  const isTypingThisLine = (index: number) => {
    return currentTyping !== null && currentTyping.lineIndex === index;
  };

  return (
    <div 
      ref={outputRef}
      className="space-y-0.5"
      role="log"
      aria-live="polite"
      aria-label="Terminal output"
    >
      {displayedLines.map((line, index) => {
        if (!line || typeof line !== 'object') {
          return null;
        }

        const isTyping = isTypingThisLine(index);
        const displayContent = isTyping 
          ? (line.content || '').substring(0, currentTyping?.charIndex || 0)
          : (line.content || '');

        return (
          <div 
            key={`${line.timestamp || index}-${index}`}
            className={`${getLineClass(line.type)} whitespace-pre-wrap break-words`}
          >
            {isTyping ? (
              <span className="inline">
                {displayContent}
                <span className="inline-block w-[8px] h-[16px] bg-[var(--starship-green)] cursor-blink ml-[1px] align-middle" />
              </span>
            ) : (
              displayContent || '\u00A0'
            )}
          </div>
        );
      })}
    </div>
  );
}