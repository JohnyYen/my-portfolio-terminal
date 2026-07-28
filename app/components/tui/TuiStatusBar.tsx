'use client';

import React from 'react';

interface TuiStatusBarProps {
  activeSection: string;
  currentIndex: number;
  totalSections: number;
  hasSearch?: boolean;
}

export default function TuiStatusBar({ activeSection, currentIndex, totalSections, hasSearch }: TuiStatusBarProps) {
  return (
    <div
      className="px-4 py-2 text-xs font-mono flex items-center gap-4 flex-shrink-0"
      style={{
        backgroundColor: 'var(--terminal-bg-secondary)',
        color: 'var(--text-muted)',
        borderTop: '1px solid var(--terminal-border)',
      }}
    >
      <span>↑↓ Navigate</span>
      <span>·</span>
      <span>Enter Select</span>
      <span>·</span>
      <span>Esc Back</span>
      <span>·</span>
      <span>? Shortcuts</span>

      {hasSearch && (
        <>
          <span>·</span>
          <span style={{ color: 'var(--starship-cyan)' }}>🔍 Searching...</span>
        </>
      )}

      <span className="ml-auto">
        Section {currentIndex}/{totalSections} · {activeSection}
      </span>
    </div>
  );
}