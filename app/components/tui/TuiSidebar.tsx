'use client';

import React from 'react';

interface Section {
  id: string;
  label: string;
  icon: string;
}

interface TuiSidebarProps {
  sections: Section[];
  activeSection: string;
  onSectionChange: (id: string) => void;
}

export default function TuiSidebar({ sections, activeSection, onSectionChange }: TuiSidebarProps) {
  return (
    <nav
      className="flex-shrink-0 border-r overflow-y-auto py-4 hidden sm:block"
      style={{
        width: '192px',
        borderColor: 'var(--terminal-border)',
        backgroundColor: 'var(--terminal-bg-secondary)',
      }}
      aria-label="Sections"
    >
      {sections.map(section => {
        const isActive = section.id === activeSection;
        return (
          <button
            key={section.id}
            onClick={() => onSectionChange(section.id)}
            className="w-full text-left px-4 py-3 flex items-center gap-3 transition-colors cursor-pointer border-l-2"
            style={{
              borderColor: isActive ? 'var(--starship-cyan)' : 'transparent',
              color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              backgroundColor: isActive ? 'rgba(54, 209, 234, 0.08)' : 'transparent',
            }}
          >
            <span style={{ fontSize: '16px' }}>{section.icon}</span>
            <span className="text-sm font-mono">{section.label}</span>
          </button>
        );
      })}
    </nav>
  );
}