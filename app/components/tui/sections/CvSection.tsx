'use client';

import React from 'react';

export default function CvSection() {
  return (
    <div className="font-mono space-y-6">
      <div>
        <h2 className="text-lg font-bold" style={{ color: 'var(--starship-cyan)' }}>
          CV / Resume
        </h2>
        <div className="h-px my-3" style={{ backgroundColor: 'var(--terminal-border)' }} />
      </div>

      <div
        className="p-4 rounded"
        style={{
          backgroundColor: 'var(--terminal-bg-secondary)',
          border: '1px solid var(--terminal-border)',
        }}
      >
        <div className="flex items-center gap-3 mb-3">
          <span style={{ fontSize: '24px' }}>📄</span>
          <div>
            <p style={{ color: 'var(--text-primary)' }}>Download CV</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Last updated: 2026
            </p>
          </div>
        </div>

        <div
          className="px-4 py-3 rounded text-sm text-center"
          style={{
            backgroundColor: 'var(--terminal-bg-elevated)',
            color: 'var(--starship-yellow)',
            border: '1px dashed var(--terminal-border)',
          }}
        >
          CV not configured yet
        </div>
      </div>

      <div
        className="p-4 rounded"
        style={{
          backgroundColor: 'var(--terminal-bg-secondary)',
          border: '1px solid var(--terminal-border)',
        }}
      >
        <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--starship-yellow)' }}>
          Contents
        </h3>
        <ul className="space-y-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <li>• Professional Summary</li>
          <li>• Work Experience</li>
          <li>• Skills &amp; Technologies</li>
          <li>• Projects</li>
          <li>• Education</li>
        </ul>
      </div>
    </div>
  );
}