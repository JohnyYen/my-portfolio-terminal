'use client';

import React, { useState, useEffect } from 'react';

interface BootSequenceProps {
  onComplete: () => void;
  username?: string;
  hostname?: string;
}

const bootMessages = [
  { text: 'Initializing...', delay: 80 },
  { text: 'Loading starship config...', delay: 120 },
  { text: '', delay: 30 },
  { text: 'Ready', delay: 80 },
];

export default function BootSequence({ 
  onComplete, 
  username = 'visitor', 
  hostname = 'portfolio' 
}: BootSequenceProps) {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentLineIndex >= bootMessages.length) {
      setIsComplete(true);
      setTimeout(() => {
        onComplete();
      }, 400);
      return;
    }

    const currentMessage = bootMessages[currentLineIndex];
    const timeout = setTimeout(() => {
      setVisibleLines(prev => [...prev, currentMessage.text]);
      setCurrentLineIndex(prev => prev + 1);
    }, currentMessage.delay);

    return () => clearTimeout(timeout);
  }, [currentLineIndex, onComplete]);

  return (
    <div className="h-screen w-full bg-[var(--terminal-bg)] text-[var(--text-primary)] font-mono p-[var(--padding-y)] flex items-center justify-center">
      <div>
        {visibleLines.map((line, index) => (
          <div 
            key={index} 
            className={line.includes('OK') || line.includes('Ready') ? 'text-[var(--starship-green)]' : 'text-[var(--text-secondary)]'}
          >
            {line || '\u00A0'}
          </div>
        ))}
        
        {!isComplete && (
          <div className="flex items-center mt-1">
            <span className="text-[var(--starship-green)]">
              {visibleLines.length > 0 && visibleLines[0].includes('Initializing') ? '...' : ''}
            </span>
            <span className="inline-block w-[8px] h-[16px] bg-[var(--starship-green)] cursor-blink ml-1" />
          </div>
        )}
      </div>
    </div>
  );
}