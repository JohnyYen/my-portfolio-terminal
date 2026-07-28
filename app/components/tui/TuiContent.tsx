'use client';

import React from 'react';
import type { Project } from '../../hooks/use-github-projects';
import AboutSection from './sections/AboutSection';
import ProjectsSection from './sections/ProjectsSection';
import SkillsSection from './sections/SkillsSection';
import SocialSection from './sections/SocialSection';
import ContactSection from './sections/ContactSection';
import CvSection from './sections/CvSection';
import TuiSearch from './TuiSearch';

interface TuiContentProps {
  activeSection: string;
  projects: Project[];
  loading: boolean;
  aboutData: any;
  skillsData: any;
  socialData: any;
  searchActive: boolean;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onSearchClose: () => void;
}

export default function TuiContent({
  activeSection, projects, loading, aboutData, skillsData, socialData,
  searchActive, searchQuery, onSearchQueryChange, onSearchClose,
}: TuiContentProps) {
  return (
    <div
      className="flex-1 overflow-y-auto p-6"
      style={{ backgroundColor: 'var(--terminal-bg)' }}
    >
      {/* Search bar — only in Projects section */}
      {searchActive && activeSection === 'projects' && (
        <TuiSearch
          query={searchQuery}
          onQueryChange={onSearchQueryChange}
          onClose={onSearchClose}
          resultCount={
            projects.filter(p => {
              const q = searchQuery.toLowerCase();
              return (
                p.name.toLowerCase().includes(q) ||
                (p.language || '').toLowerCase().includes(q) ||
                (p.description || '').toLowerCase().includes(q)
              );
            }).length
          }
        />
      )}

      {activeSection === 'about' && <AboutSection data={aboutData} />}
      {activeSection === 'projects' && (
        <ProjectsSection
          projects={projects}
          loading={loading}
          searchQuery={searchActive ? searchQuery : ''}
        />
      )}
      {activeSection === 'skills' && <SkillsSection data={skillsData} />}
      {activeSection === 'social' && <SocialSection data={socialData} />}
      {activeSection === 'contact' && <ContactSection data={socialData} />}
      {activeSection === 'cv' && <CvSection />}
    </div>
  );
}