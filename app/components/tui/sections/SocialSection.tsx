'use client';

import React from 'react';

interface SocialData {
  github: string;
  linkedin: string;
  email: string;
}

interface SocialSectionProps {
  data: SocialData;
}

export default function SocialSection({ data }: SocialSectionProps) {
  const links = [
    { icon: '🐙', label: 'GitHub', url: data.github },
    { icon: '💼', label: 'LinkedIn', url: data.linkedin },
    { icon: '📧', label: 'Email', url: `mailto:${data.email}` },
  ];

  return (
    <div className="font-mono space-y-6">
      <div>
        <h2 className="text-lg font-bold" style={{ color: 'var(--starship-cyan)' }}>
          Social
        </h2>
        <div className="h-px my-3" style={{ backgroundColor: 'var(--terminal-border)' }} />
      </div>

      <div className="space-y-3">
        {links.map((link, i) => (
          <a
            key={i}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded hover:underline transition-colors"
            style={{
              backgroundColor: 'var(--terminal-bg-secondary)',
              border: '1px solid var(--terminal-border)',
              color: 'var(--starship-cyan)',
            }}
          >
            <span style={{ fontSize: '18px' }}>{link.icon}</span>
            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
              {link.label}
            </span>
            <span className="text-sm ml-auto" style={{ color: 'var(--text-muted)' }}>
              {link.url.replace('https://', '').replace('mailto:', '')}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}