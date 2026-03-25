'use client';

import React from 'react';

interface PromptProps {
  username?: string;
  hostname?: string;
  currentPath?: string;
  gitBranch?: string;
  gitStatus?: 'clean' | 'dirty' | 'staged';
  className?: string;
}

export default function Prompt({ 
  username = 'visitor', 
  hostname = 'portfolio', 
  currentPath = '~',
  gitBranch,
  gitStatus = 'clean',
  className = ''
}: PromptProps) {
  // Get icon for git status
  const getGitStatusIcon = () => {
    switch (gitStatus) {
      case 'dirty': return '!';
      case 'staged': return '+';
      default: return '✓';
    }
  };

  const getGitStatusColor = () => {
    switch (gitStatus) {
      case 'dirty': return 'text-[var(--starship-red)]';
      case 'staged': return 'text-[var(--starship-yellow)]';
      default: return 'text-[var(--starship-green)]';
    }
  };

  return (
    <div className={`flex items-center ${className}`} role="presentation">
      {/* Username segment */}
      <span 
        className="starship-segment text-[var(--text-bright)] font-semibold"
        style={{ backgroundColor: 'rgba(163, 113, 247, 0.15)' }}
      >
        <span className="text-[var(--starship-purple)]">❯</span>
        <span>{username}</span>
      </span>
      
      {/* Arrow separator */}
      <span 
        className="starship-arrow" 
        style={{ borderLeftColor: 'rgba(88, 166, 255, 0.15)' }}
        aria-hidden="true"
      />
      
      {/* Hostname segment */}
      <span 
        className="starship-segment text-[var(--text-primary)]"
        style={{ backgroundColor: 'rgba(88, 166, 255, 0.12)' }}
      >
        <span className="text-[var(--starship-cyan)]">@</span>
        <span className="text-[var(--starship-cyan)] font-medium">{hostname}</span>
      </span>
      
      {/* Arrow separator */}
      <span 
        className="starship-arrow" 
        style={{ borderLeftColor: 'rgba(63, 185, 80, 0.12)' }}
        aria-hidden="true"
      />
      
      {/* Directory segment */}
      <span 
        className="starship-segment text-[var(--text-primary)]"
        style={{ backgroundColor: 'rgba(63, 185, 80, 0.1)' }}
      >
        <span className="text-[var(--starship-green)] mr-1">📁</span>
        <span className="text-[var(--starship-cyan)] font-semibold">{currentPath}</span>
      </span>
      
      {/* Git branch segment (if available) */}
      {gitBranch && (
        <>
          <span 
            className="starship-arrow" 
            style={{ borderLeftColor: 'rgba(219, 109, 40, 0.12)' }}
            aria-hidden="true"
          />
          <span 
            className="starship-segment text-[var(--text-primary)]"
            style={{ backgroundColor: 'rgba(219, 109, 40, 0.1)' }}
          >
            <span className="text-[var(--starship-orange)] mr-1">⎇</span>
            <span className="text-[var(--starship-orange)] font-medium">{gitBranch}</span>
            <span className={`ml-1 text-xs ${getGitStatusColor()}`}>
              {getGitStatusIcon()}
            </span>
          </span>
        </>
      )}
      
      {/* Arrow to prompt symbol */}
      <span 
        className="starship-arrow" 
        style={{ borderLeftColor: 'rgba(188, 140, 255, 0.12)' }}
        aria-hidden="true"
      />
      
      {/* Prompt symbol segment */}
      <span 
        className="starship-segment text-glow-green"
        style={{ backgroundColor: 'rgba(63, 185, 80, 0.08)' }}
      >
        <span className="text-[var(--starship-green)] font-bold text-lg">❯</span>
      </span>
      
      {/* Space after prompt */}
      <span className="w-2" aria-hidden="true" />
    </div>
  );
}
