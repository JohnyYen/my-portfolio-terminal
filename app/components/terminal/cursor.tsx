'use client';

import React from 'react';

interface CursorProps {
  className?: string;
}

export default function Cursor({ className = '' }: CursorProps) {
  return (
    <span 
      className={`inline-block w-[10px] h-[20px] bg-[#00ff00] cursor-blink ${className}`}
      aria-hidden="true"
    />
  );
}
