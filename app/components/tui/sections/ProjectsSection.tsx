'use client';

import React from 'react';
import type { Project } from '../../../hooks/use-github-projects';

interface ProjectsSectionProps {
  projects: Project[];
  loading: boolean;
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const updated = new Date(dateStr).getTime();
  const diffMs = now - updated;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 30) return `${diffDays}d ago`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths}mo ago`;
  return `${Math.floor(diffMonths / 12)}y ago`;
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f7df1e',
  Python: '#3572a5',
  Go: '#00add8',
  Rust: '#dea584',
  Shell: '#89e051',
  HTML: '#e34c26',
  CSS: '#563d7c',
};

function langColor(lang: string | null): string {
  if (!lang) return 'var(--text-muted)';
  return LANG_COLORS[lang] || 'var(--text-muted)';
}

export default function ProjectsSection({ projects, loading }: ProjectsSectionProps) {
  return (
    <div className="font-mono space-y-6">
      <div>
        <h2 className="text-lg font-bold" style={{ color: 'var(--starship-cyan)' }}>
          Projects
        </h2>
        <div className="h-px my-3" style={{ backgroundColor: 'var(--terminal-border)' }} />
      </div>

      {loading && (
        <p style={{ color: 'var(--starship-cyan)' }}>⏳ Fetching projects from GitHub...</p>
      )}

      {!loading && projects.length === 0 && (
        <p style={{ color: 'var(--text-muted)' }}>
          No projects found. Tag repos with &quot;showcase&quot; on GitHub to see them here.
        </p>
      )}

      <div className="grid gap-4">
        {projects.map((project, i) => (
          <div
            key={i}
            className="p-4 rounded"
            style={{
              backgroundColor: 'var(--terminal-bg-secondary)',
              border: '1px solid var(--terminal-border)',
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span style={{ fontSize: '16px' }}>📦</span>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold hover:underline"
                style={{ color: 'var(--starship-cyan)' }}
              >
                {project.name}
              </a>
            </div>
            <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
              {project.description || 'No description'}
            </p>
            <div className="flex items-center gap-4 text-xs">
              {project.language && (
                <span className="flex items-center gap-1" style={{ color: 'var(--text-primary)' }}>
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: langColor(project.language) }}
                  />
                  {project.language}
                </span>
              )}
              <span style={{ color: 'var(--starship-yellow)' }}>⭐ {project.stars}</span>
              <span style={{ color: 'var(--text-secondary)' }}>🍴 {project.forks}</span>
              <span style={{ color: 'var(--text-muted)' }}>
                Updated {timeAgo(project.updatedAt)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}