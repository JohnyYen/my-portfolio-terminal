'use client';

import React, { useState, useEffect } from 'react';

interface BootSequenceProps {
  onComplete: () => void;
  username?: string;
  hostname?: string;
}

const bootMessages = [
  { text: '[  OK  ] Started Show Plymouth Boot Screen', delay: 100 },
  { text: '[  OK  ] Reached target Local File Systems', delay: 150 },
  { text: '[  OK  ] Started Journal Service', delay: 200 },
  { text: '[  OK  ] Started Network Manager', delay: 180 },
  { text: '[  OK  ] Started System Logger', delay: 120 },
  { text: '[  OK  ] Reached target Graphical Interface', delay: 250 },
  { text: '', delay: 50 },
  { text: 'Ubuntu 24.04 LTS', delay: 100 },
  { text: '', delay: 50 },
  { text: '  ___  ____   ___  ', delay: 80 },
  { text: ' / _ \\/ ___| / _ \\ ', delay: 80 },
  { text: '| | | \\___ \\| | | |', delay: 80 },
  { text: '| |_| |___) | |_| |', delay: 80 },
  { text: ' \\___/|____/ \\___/ ', delay: 80 },
  { text: '', delay: 50 },
  { text: 'Terminal Portfolio v1.0.0', delay: 150 },
  { text: '', delay: 50 },
  { text: '[  OK  ] Started Terminal Service', delay: 200 },
  { text: '[  OK  ] Loaded Portfolio Data', delay: 180 },
  { text: '[  OK  ] Ready to accept commands', delay: 250 },
  { text: '', delay: 100 },
  { text: '══════════════════════════════════════════════════════════════', delay: 100 },
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
      }, 500);
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
    <div className="h-screen w-full bg-[#0a0a0a] text-[#00ff00] font-mono p-4 flex flex-col">
      <div className="flex-1 flex flex-col max-w-4xl w-full mx-auto">
        {/* Terminal header */}
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#333]">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#27ca3f]" />
          </div>
          <span className="text-[#888] ml-4">
            {username}@{hostname}: ~
          </span>
        </div>

        {/* Boot messages */}
        <div className="flex-1 overflow-hidden">
          {visibleLines.map((line, index) => (
            <div 
              key={index} 
              className={`whitespace-pre ${
                line.includes('[  OK  ]') ? 'text-[#00ff00]' : 
                line.includes('Terminal Portfolio') ? 'text-[#ffb000] font-bold' :
                'text-[#00ff00]'
              }`}
            >
              {line}
            </div>
          ))}
          
          {/* Boot cursor */}
          {!isComplete && (
            <div className="flex items-center mt-2">
              <span className="text-[#00ff00]">Boot in progress</span>
              <span className="inline-block w-[10px] h-[20px] bg-[#00ff00] cursor-blink ml-2" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
