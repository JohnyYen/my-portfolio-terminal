'use client';

import React, { useEffect, useRef } from 'react';

interface ShortcutGroup {
  title: string;
  shortcuts: { key: string; description: string }[];
}

const SHORTCUT_GROUPS: ShortcutGroup[] = [
  {
    title: 'Terminal',
    shortcuts: [
      { key: '↑ / ↓', description: 'Command history' },
      { key: 'Tab', description: 'Autocomplete command' },
      { key: 'Ctrl+C', description: 'Cancel current input' },
      { key: 'Ctrl+L', description: 'Clear terminal' },
    ],
  },
  {
    title: 'TUI Menu',
    shortcuts: [
      { key: '↑ / ↓', description: 'Navigate sections' },
      { key: 'Enter', description: 'Select / open section' },
      { key: 'Esc', description: 'Return to terminal' },
      { key: '/', description: 'Search projects' },
      { key: '?', description: 'Show keyboard shortcuts' },
    ],
  },
  {
    title: 'Welcome Banner',
    shortcuts: [
      { key: 'Click pill', description: 'Execute command' },
      { key: 'Type any key', description: 'Dismiss banner' },
    ],
  },
];

interface TuiShortcutsProps {
  onClose: () => void;
}

export default function TuiShortcuts({ onClose }: TuiShortcutsProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    overlayRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <div
      ref={overlayRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={onClose}
      className="absolute inset-0 z-10 flex items-center justify-center p-6"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="font-mono max-w-lg w-full rounded p-6"
        style={{
          backgroundColor: 'var(--terminal-bg-secondary)',
          border: '1px solid var(--terminal-border)',
        }}
      >
        {/* Title */}
        <div className="text-center mb-5">
          <span className="text-sm font-bold" style={{ color: 'var(--starship-cyan)' }}>
            ╭─ Keyboard Shortcuts ───────────────────────────╮
          </span>
        </div>

        {/* Groups */}
        <div className="space-y-5">
          {SHORTCUT_GROUPS.map((group) => (
            <div key={group.title}>
              <h3
                className="text-xs font-semibold mb-2 uppercase tracking-wider"
                style={{ color: 'var(--starship-yellow)' }}
              >
                {group.title}
              </h3>
              <div className="space-y-1.5">
                {group.shortcuts.map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between text-sm"
                  >
                    <kbd
                      className="px-2 py-0.5 rounded text-xs"
                      style={{
                        backgroundColor: 'var(--terminal-bg-elevated)',
                        color: 'var(--starship-green)',
                        border: '1px solid var(--terminal-border)',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {item.key}
                    </kbd>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {item.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-5 text-center">
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Press <kbd style={{ color: 'var(--starship-green)' }}>Esc</kbd> to close
          </span>
        </div>

        <div className="text-center mt-1">
          <span className="text-xs" style={{ color: 'var(--starship-cyan)' }}>
            ╰──────────────────────────────────────────────────╯
          </span>
        </div>
      </div>
    </div>
  );
}