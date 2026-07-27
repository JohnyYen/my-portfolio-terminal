'use client';

import React from 'react';

interface PromptProps {
  username?: string;
  hostname?: string;
  currentPath?: string;
  className?: string;
}

// Dragon icon SVG - stylized Cygame-style dragon head
const DragonIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className}
    viewBox="0 0 24 24" 
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Dragon head - minimal geometric */}
    <path 
      d="M12 2L2 8v8c0 5.5 4.5 10 10 10s10-4.5 10-10V8L12 2z" 
      fill="currentColor" 
      opacity="0.15"
    />
    <path 
      d="M12 2L2 8v8c0 5.5 4.5 10 10 10s10-4.5 10-10V8L12 2z" 
      stroke="currentColor" 
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Eye */}
    <circle cx="9" cy="9" r="1.5" fill="currentColor" />
    <circle cx="15" cy="9" r="1.5" fill="currentColor" />
    {/* Snout */}
    <path 
      d="M10 14h4M12 12v4" 
      stroke="currentColor" 
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    {/* Horns */}
    <path 
      d="M5 6l-2 3M19 6l2 3" 
      stroke="currentColor" 
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export default function Prompt({ 
  username = 'visitor', 
  hostname = 'portfolio', 
  currentPath = '~',
  className = ''
}: PromptProps) {
  return (
    <div 
      className={`flex items-center gap-2 leading-relaxed ${className}`}
      role="presentation"
    >
      {/* Dragon icon */}
      <DragonIcon className="w-4 h-4 text-[var(--starship-purple)]" />
      
      {/* Username */}
      <span className="text-[var(--starship-purple)]">{username}</span>
      
      {/* Separator */}
      <span className="text-[var(--text-muted)]">@</span>
      
      {/* Hostname */}
      <span className="text-[var(--starship-cyan)]">{hostname}</span>
      
      {/* Separator */}
      <span className="text-[var(--text-muted)]">:</span>
      
      {/* Path */}
      <span className="text-[var(--starship-yellow)]">{currentPath}</span>
      
      {/* Prompt symbol */}
      <span className="text-[var(--starship-green)] ml-1">$</span>
    </div>
  );
}