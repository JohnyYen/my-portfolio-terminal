'use client';

import React, { useRef, useEffect } from 'react';

interface TuiSearchProps {
  query: string;
  onQueryChange: (query: string) => void;
  onClose: () => void;
  resultCount: number;
}

export default function TuiSearch({ query, onQueryChange, onClose, resultCount }: TuiSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <div
      className="flex items-center gap-3 px-4 py-2.5 mb-4 rounded"
      style={{
        backgroundColor: 'var(--terminal-bg-secondary)',
        border: '1px solid var(--terminal-border)',
      }}
    >
      <span style={{ color: 'var(--starship-cyan)', fontSize: '14px' }}>🔍</span>

      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search projects by name, language, or description..."
        className="flex-1 bg-transparent text-sm font-mono outline-none"
        style={{
          color: 'var(--text-primary)',
          caretColor: 'var(--starship-green)',
        }}
        autoComplete="off"
        spellCheck={false}
      />

      {query && (
        <span className="text-xs whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
          {resultCount} result{resultCount !== 1 ? 's' : ''}
        </span>
      )}

      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
        <kbd style={{ color: 'var(--starship-green)' }}>Esc</kbd> close
      </span>
    </div>
  );
}