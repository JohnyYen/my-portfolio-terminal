'use client';

import React, { useEffect, useState, useRef } from 'react';

interface OutputLine {
  type: 'stdout' | 'stderr' | 'stdin' | 'info' | 'success' | 'warning' | 'boot-ok' | 'boot-info' | 'boot-warning';
  content: string;
  timestamp: number;
}

interface OutputProps {
  lines: OutputLine[];
  typingSpeed?: number;
}

export default function Output({ lines, typingSpeed = 8 }: OutputProps) {
  const [displayedLines, setDisplayedLines] = useState<OutputLine[]>([]);
  const [currentTyping, setCurrentTyping] = useState<{ lineIndex: number; charIndex: number } | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const lastProcessedIndex = useRef<number>(-1);

  // Handle new lines - start typing animation for new lines
  useEffect(() => {
    if (lines.length === 0) {
      setDisplayedLines([]);
      lastProcessedIndex.current = -1;
      return;
    }

    // Find new lines that haven't been processed
    const lastLineIndex = lines.length - 1;
    
    if (lastLineIndex > lastProcessedIndex.current) {
      // New line(s) added - start typing the latest one
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
      // Update displayed lines with empty content
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
        
        // Update displayed content with partial text
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
      // Typing complete for this line
      lastProcessedIndex.current = lineIndex;
      setCurrentTyping(null);
    }
  }, [currentTyping, lines, typingSpeed]);

  // Auto-scroll to bottom when content changes
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
        return 'output-stdout font-semibold';
      case 'info':
        return 'output-info';
      case 'success':
        return 'output-success';
      case 'warning':
        return 'output-warning';
      case 'boot-ok':
        return 'boot-ok';
      case 'boot-info':
        return 'boot-info';
      case 'boot-warning':
        return 'boot-warning';
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
      className="flex-1 terminal-selectable space-y-0.5"
      role="log"
      aria-live="polite"
      aria-label="Terminal output"
    >
      {displayedLines.map((line, index) => {
        // Safety check - skip if line is undefined
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
            className={`${getLineClass(line.type)} whitespace-pre-wrap break-words leading-relaxed`}
          >
            {isTyping ? (
              <span className="inline">
                {displayContent}
                <span className="inline-block w-[8px] h-[16px] bg-[var(--starship-green)] cursor-blink cursor-glow ml-[1px] align-middle" />
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
