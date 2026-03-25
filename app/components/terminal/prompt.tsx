'use client';

import React from 'react';

interface PromptProps {
  username?: string;
  hostname?: string;
  currentPath?: string;
  gitBranch?: string;
}

export default function Prompt({ 
  username = 'visitor', 
  hostname = 'portfolio', 
  currentPath = '~',
  gitBranch 
}: PromptProps) {
  return (
    <div className="flex items-center gap-1 text-[#00ff00] font-medium">
      {/* User and Host */}
      <span className="text-[#bd93f9]">{username}</span>
      <span className="text-[#f8f8f8]">@</span>
      <span className="text-[#8be9fd]">{hostname}</span>
      
      {/* Separator */}
      <span className="text-[#f8f8f8]">:</span>
      
      {/* Path */}
      <span className="text-[#50fa7b] font-bold">{currentPath}</span>
      
      {/* Git branch if available */}
      {gitBranch && (
        <>
          <span className="text-[#f8f8f8]">:</span>
          <span className="text-[#ffb000]">({gitBranch})</span>
        </>
      )}
      
      {/* Prompt symbol */}
      <span className="text-[#ff79c6] ml-1">$</span>
      <span className="text-[#f8f8f8]"> </span>
    </div>
  );
}
