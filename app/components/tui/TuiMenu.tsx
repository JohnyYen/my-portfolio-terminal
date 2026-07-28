'use client';

import React, { useRef, useEffect, useCallback, useState } from 'react';
import TuiSidebar from './TuiSidebar';
import TuiContent from './TuiContent';
import TuiStatusBar from './TuiStatusBar';
import TuiShortcuts from './TuiShortcuts';
import type { Project } from '../../hooks/use-github-projects';

interface TuiMenuProps {
  projects: Project[];
  loading: boolean;
  aboutData: any;
  skillsData: any;
  socialData: any;
  activeSection: string;
  onSectionChange: (section: string) => void;
  onExit: () => void;
}

const SECTIONS = [
  { id: 'about', label: 'About', icon: '👤' },
  { id: 'projects', label: 'Projects', icon: '📦' },
  { id: 'skills', label: 'Skills', icon: '🛠' },
  { id: 'social', label: 'Social', icon: '🌐' },
  { id: 'contact', label: 'Contact', icon: '📧' },
  { id: 'cv', label: 'CV', icon: '📄' },
];

export default function TuiMenu({
  projects, loading, aboutData, skillsData, socialData,
  activeSection, onSectionChange, onExit,
}: TuiMenuProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const currentIndex = SECTIONS.findIndex(s => s.id === activeSection);

    // If shortcuts overlay is open, only Esc works (handled by TuiShortcuts)
    if (showShortcuts) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        onSectionChange(SECTIONS[(currentIndex + 1) % SECTIONS.length].id);
        break;
      case 'ArrowUp':
        e.preventDefault();
        onSectionChange(SECTIONS[(currentIndex - 1 + SECTIONS.length) % SECTIONS.length].id);
        break;
      case 'Escape':
        e.preventDefault();
        if (searchActive) {
          setSearchActive(false);
          setSearchQuery('');
        } else {
          onExit();
        }
        break;
      case '?':
        if (!searchActive) {
          e.preventDefault();
          setShowShortcuts(true);
        }
        break;
      case '/':
        if (!searchActive) {
          e.preventDefault();
          setSearchActive(true);
          setSearchQuery('');
        }
        break;
    }
  }, [activeSection, onSectionChange, onExit, showShortcuts, searchActive]);

  const activeLabel = SECTIONS.find(s => s.id === activeSection)?.label || '';
  const currentIndex = SECTIONS.findIndex(s => s.id === activeSection) + 1;

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="flex flex-row h-full outline-none relative"
      style={{ minHeight: '300px' }}
    >
      <TuiSidebar
        sections={SECTIONS}
        activeSection={activeSection}
        onSectionChange={onSectionChange}
      />
      <div className="flex flex-col flex-1 min-w-0">
        <TuiContent
          activeSection={activeSection}
          projects={projects}
          loading={loading}
          aboutData={aboutData}
          skillsData={skillsData}
          socialData={socialData}
          searchActive={searchActive}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          onSearchClose={() => { setSearchActive(false); setSearchQuery(''); }}
        />
        <TuiStatusBar
          activeSection={activeLabel}
          currentIndex={currentIndex}
          totalSections={SECTIONS.length}
          hasSearch={searchActive}
        />
      </div>

      {/* Shortcuts overlay */}
      {showShortcuts && (
        <TuiShortcuts onClose={() => setShowShortcuts(false)} />
      )}
    </div>
  );
}