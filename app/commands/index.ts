export interface Command {
  name: string;
  description: string;
  usage?: string;
  aliases?: string[];
  handler: (args: string[], history?: string[]) => CommandResult;
}

export interface CommandResult {
  output: string[];
  type: 'stdout' | 'stderr' | 'info';
}

export interface ParsedCommand {
  command: string;
  args: string[];
  flags: string[];
}

// Parse command string into command, args, and flags
export function parseCommand(input: string): ParsedCommand {
  const parts = input.trim().split(/\s+/);
  const command = parts[0]?.toLowerCase() || '';
  const args: string[] = [];
  const flags: string[] = [];

  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    if (part.startsWith('--')) {
      flags.push(part.substring(2));
    } else if (part.startsWith('-')) {
      flags.push(part.substring(1));
    } else {
      args.push(part);
    }
  }

  return { command, args, flags };
}

// Command registry
const commands: Command[] = [
  {
    name: 'help',
    description: 'Show available commands',
    handler: () => ({
      output: [
        'Available commands:',
        '',
        '  help          - Show this help message',
        '  about         - Learn about me',
        '  bio           - My biography and background',
        '  skills        - View my technical skills',
        '  cv            - Download my CV/resume',
        '  projects      - Browse my projects',
        '  contact       - How to reach me',
        '  clear, cls    - Clear the terminal',
        '  history       - Show command history',
        '  whoami        - Display current user',
        '  date          - Show current date/time',
        '  echo          - Print text',
        '',
        'Tips:',
        '  - Use Tab for autocomplete',
        '  - Use ↑/↓ arrows for command history',
        '  - Type a command and press Enter to execute',
      ],
      type: 'stdout' as const
    })
  },
  {
    name: 'about',
    description: 'Learn about me',
    handler: () => ({
      output: [
        '╔══════════════════════════════════════════════════════════════╗',
        '║                        ABOUT ME                             ║',
        '╚══════════════════════════════════════════════════════════════╝',
        '',
        '👋 Hello! I\'m a passionate developer who loves building things.',
        '',
        '🎯 Focus Areas:',
        '   • Full-stack web development',
        '   • System architecture',
        '   • Open source contributions',
        '   • Creative problem solving',
        '',
        '💡 Philosophy:',
        '   "Code is poetry, and every bug is an opportunity to learn."',
        '',
        '🌱 Always learning, always growing.',
        '',
        'Try "bio" for more details or "skills" to see my tech stack!',
      ],
      type: 'stdout' as const
    })
  },
  {
    name: 'bio',
    description: 'My biography and background',
    handler: () => ({
      output: [
        '┌─────────────────────────────────────────────────────────────┐',
        '│                        BIOGRAPHY                           │',
        '└─────────────────────────────────────────────────────────────┘',
        '',
        '📖 Background:',
        '   I started my journey in tech when I wrote my first "Hello World"',
        '   and realized the power of creating something from nothing.',
        '',
        '🎓 Education:',
        '   • Computer Science degree',
        '   • Continuous learner through online courses and books',
        '   • Conference speaker and workshop instructor',
        '',
        '💼 Experience:',
        '   • 5+ years in software development',
        '   • Worked with startups and enterprise companies',
        '   • Led teams and mentored junior developers',
        '',
        '🎯 Current Focus:',
        '   • Building developer tools',
        '   • Exploring AI/ML applications',
        '   • Contributing to open source',
        '',
        '🌍 Based in the digital realm, available worldwide.',
      ],
      type: 'stdout' as const
    })
  },
  {
    name: 'skills',
    description: 'View my technical skills',
    handler: (args: string[]) => {
      const category = args[0]?.toLowerCase();
      
      const skills = {
        frontend: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Vue.js'],
        backend: ['Node.js', 'Python', 'Go', 'PostgreSQL', 'MongoDB'],
        devops: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Terraform'],
        tools: ['Git', 'VS Code', 'Figma', 'Linux', 'Vim'],
        other: ['System Design', 'Agile', 'TDD', 'Clean Code', 'Architecture']
      };

      if (category && skills[category as keyof typeof skills]) {
        return {
          output: [
            `Skills - ${category.toUpperCase()}:`,
            '',
            ...skills[category as keyof typeof skills].map(s => `  ✓ ${s}`),
          ],
          type: 'stdout' as const
        };
      }

      return {
        output: [
          '╔══════════════════════════════════════════════════════════════╗',
          '║                      TECHNICAL SKILLS                       ║',
          '╚══════════════════════════════════════════════════════════════╝',
          '',
          'Frontend:     React, Next.js, TypeScript, Tailwind CSS, Vue.js',
          'Backend:      Node.js, Python, Go, PostgreSQL, MongoDB',
          'DevOps:       Docker, Kubernetes, AWS, CI/CD, Terraform',
          'Tools:        Git, VS Code, Figma, Linux, Vim',
          'Other:        System Design, Agile, TDD, Clean Code',
          '',
          'Tip: Run "skills frontend" to see only frontend skills!',
          'Categories: frontend, backend, devops, tools, other',
        ],
        type: 'stdout' as const
      };
    },
    aliases: ['tech', 'stack']
  },
  {
    name: 'cv',
    description: 'Download my CV/resume',
    handler: () => ({
      output: [
        '📄 CV/Resume:',
        '',
        '   📥 Download: https://example.com/cv.pdf',
        '   🌐 Online: https://example.com/resume',
        '',
        '   Last updated: March 2026',
        '',
        '   Sections:',
        '   • Professional Summary',
        '   • Work Experience',
        '   • Education',
        '   • Skills & Technologies',
        '   • Projects & Achievements',
        '   • Certifications',
      ],
      type: 'stdout' as const
    }),
    aliases: ['resume']
  },
  {
    name: 'projects',
    description: 'Browse my projects',
    handler: (args: string[]) => {
      const filter = args[0]?.toLowerCase();
      
      const projects = [
        {
          name: 'Terminal Portfolio',
          desc: 'Interactive terminal-style portfolio (this site!)',
          tech: ['Next.js', 'TypeScript', 'Tailwind CSS'],
          link: 'https://github.com/johny/terminal-portfolio'
        },
        {
          name: 'DevDash',
          desc: 'Developer dashboard for tracking productivity',
          tech: ['React', 'Node.js', 'PostgreSQL'],
          link: 'https://github.com/johny/devdash'
        },
        {
          name: 'CLI Tools',
          desc: 'Collection of useful command-line utilities',
          tech: ['Go', 'Bash', 'Python'],
          link: 'https://github.com/johny/cli-tools'
        },
        {
          name: 'AI Code Review',
          desc: 'AI-powered code review tool',
          tech: ['Python', 'OpenAI', 'GitHub API'],
          link: 'https://github.com/johny/ai-code-review'
        },
      ];

      if (filter) {
        const filtered = projects.filter(p => 
          p.tech.some(t => t.toLowerCase().includes(filter)) ||
          p.name.toLowerCase().includes(filter)
        );
        
        if (filtered.length === 0) {
          return {
            output: [`No projects found matching "${filter}"`],
            type: 'stderr' as const
          };
        }

        return {
          output: [
            `Projects matching "${filter}":`,
            '',
            ...filtered.map(p => [
              `📦 ${p.name}`,
              `   ${p.desc}`,
              `   Tech: ${p.tech.join(', ')}`,
              `   🔗 ${p.link}`,
              ''
            ].join('\n')),
          ],
          type: 'stdout' as const
        };
      }

      return {
        output: [
          '╔══════════════════════════════════════════════════════════════╗',
          '║                        MY PROJECTS                          ║',
          '╚══════════════════════════════════════════════════════════════╝',
          '',
          ...projects.flatMap(p => [
            `📦 ${p.name}`,
            `   ${p.desc}`,
            `   Tech: ${p.tech.join(', ')}`,
            `   🔗 ${p.link}`,
            ''
          ]),
          'Tip: Run "projects next" to filter by technology!',
        ],
        type: 'stdout' as const
      };
    },
    aliases: ['work', 'portfolio']
  },
  {
    name: 'contact',
    description: 'How to reach me',
    handler: () => ({
      output: [
        '╔══════════════════════════════════════════════════════════════╗',
        '║                      CONTACT ME                             ║',
        '╚══════════════════════════════════════════════════════════════╝',
        '',
        '📧 Email:    hello@example.com',
        '🐦 Twitter:  @yourhandle',
        '💼 LinkedIn: linkedin.com/in/yourprofile',
        '🐙 GitHub:   github.com/johndoe',
        '',
        'Feel free to reach out for:',
        '  • Collaboration opportunities',
        '  • Speaking engagements',
        '  • Consulting work',
        '  • Just to say hi!',
        '',
        'Response time: Usually within 24-48 hours',
      ],
      type: 'stdout' as const
    }),
    aliases: ['email', 'reach']
  },
  {
    name: 'clear',
    description: 'Clear the terminal',
    handler: () => ({
      output: [],
      type: 'stdout' as const
    }),
    aliases: ['cls', 'reset']
  },
  {
    name: 'history',
    description: 'Show command history',
    handler: (_args: string[], history?: string[]) => {
      if (!history || history.length === 0) {
        return {
          output: ['No commands in history.'],
          type: 'stdout' as const
        };
      }

      return {
        output: [
          'Command history:',
          '',
          ...history.map((cmd, i) => `  ${i + 1}  ${cmd}`)
        ],
        type: 'stdout' as const
      };
    }
  },
  {
    name: 'whoami',
    description: 'Display current user',
    handler: () => ({
      output: ['visitor'],
      type: 'stdout' as const
    })
  },
  {
    name: 'date',
    description: 'Show current date/time',
    handler: () => ({
      output: [new Date().toString()],
      type: 'stdout' as const
    })
  },
  {
    name: 'echo',
    description: 'Print text',
    handler: (args: string[]) => ({
      output: [args.join(' ') || ''],
      type: 'stdout' as const
    })
  }
];

// Get list of available command names
export function getAvailableCommands(): string[] {
  const names = commands.map(c => c.name);
  commands.forEach(c => {
    if (c.aliases) {
      names.push(...c.aliases);
    }
  });
  return [...new Set(names)];
}

// Execute a parsed command
export function executeCommand(parsed: ParsedCommand, history?: string[]): CommandResult {
  const { command, args } = parsed;

  if (!command) {
    return { output: [''], type: 'stdout' };
  }

  // Find command by name or alias
  const cmd = commands.find(c => 
    c.name === command || c.aliases?.includes(command)
  );

  if (!cmd) {
    return {
      output: [
        `bash: ${command}: command not found`,
        '',
        'Type "help" to see available commands.'
      ],
      type: 'stderr'
    };
  }

  // Execute command handler
  return cmd.handler(args, history);
}

// Get command suggestions for autocomplete
export function getCommandSuggestions(partial: string): string[] {
  const available = getAvailableCommands();
  return available.filter(cmd => 
    cmd.toLowerCase().startsWith(partial.toLowerCase())
  ).slice(0, 5);
}
