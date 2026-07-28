'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import TuiSidebar from './TuiSidebar';
import TuiContent from './TuiContent';
import TuiStatusBar from './TuiStatusBar';
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

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const currentIndex = SECTIONS.findIndex(s => s.id === activeSection);

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
        onExit();
        break;
    }
  }, [activeSection, onSectionChange, onExit]);

  const activeLabel = SECTIONS.find(s => s.id === activeSection)?.label || '';
  const currentIndex = SECTIONS.findIndex(s => s.id === activeSection) + 1;

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="flex flex-row h-full outline-none"
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
        />
        <TuiStatusBar
          activeSection={activeLabel}
          currentIndex={currentIndex}
          totalSections={SECTIONS.length}
        />
      </div>
    </div>
  );
}