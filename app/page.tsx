'use client';

import React, { useState } from 'react';
import Terminal from './components/terminal/terminal';
import BootSequence from './components/boot-sequence/boot-sequence';

export default function Home() {
  const [showTerminal, setShowTerminal] = useState(false);

  const handleBootComplete = () => {
    setShowTerminal(true);
  };

  return (
    <>
      {!showTerminal ? (
        <BootSequence 
          onComplete={handleBootComplete}
          username="visitor"
          hostname="portfolio"
        />
      ) : (
        <Terminal 
          username="visitor"
          hostname="portfolio"
        />
      )}
    </>
  );
}
