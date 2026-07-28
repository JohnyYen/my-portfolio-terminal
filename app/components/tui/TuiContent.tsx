'use client';

import React from 'react';
import type { Project } from '../../hooks/use-github-projects';
import AboutSection from './sections/AboutSection';
import ProjectsSection from './sections/ProjectsSection';
import SkillsSection from './sections/SkillsSection';
import SocialSection from './sections/SocialSection';
import ContactSection from './sections/ContactSection';
import CvSection from './sections/CvSection';

interface TuiContentProps {
  activeSection: string;
  projects: Project[];
  loading: boolean;
  aboutData: any;
  skillsData: any;
  socialData: any;
}

export default function TuiContent({
  activeSection, projects, loading, aboutData, skillsData, socialData,
}: TuiContentProps) {
  return (
    <div
      className="flex-1 overflow-y-auto p-6"
      style={{ backgroundColor: 'var(--terminal-bg)' }}
    >
      {activeSection === 'about' && <AboutSection data={aboutData} />}
      {activeSection === 'projects' && <ProjectsSection projects={projects} loading={loading} />}
      {activeSection === 'skills' && <SkillsSection data={skillsData} />}
      {activeSection === 'social' && <SocialSection data={socialData} />}
      {activeSection === 'contact' && <ContactSection data={socialData} />}
      {activeSection === 'cv' && <CvSection />}
    </div>
  );
}