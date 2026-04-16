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

// Dragon ASCII Art
const DRAGON_ASCII = `
        ███╗   ██╗███████╗██╗  ██╗██╗   ██╗███████╗
        ████╗  ██║██╔════╝╚██╗██╔╝██║   ██║██╔════╝
        ██╔██╗ ██║█████╗   ╚███╔╝ ██║   ██║███████╗
        ██║╚██╗██║██╔══╝   ██╔██╗ ██║   ██║╚════██║
        ██║ ╚████║███████╗██╔╝ ╚██╗╚██████╔╝███████║
        ╚═╝  ╚═══╝╚══════╝╚═╝   ╚═╝ ╚═════╝ ╚══════╝`;

// GitHub User Data
const GITHUB_USER = 'JohnyYen';

// Projects pinned on GitHub
const projects = [
  {
    name: 'ignix-core',
    desc: 'Core library for Ignite/X framework. Provides reactive utilities and state management patterns for building scalable TypeScript applications.',
    tech: 'TypeScript',
    url: 'https://github.com/JohnyYen/ignix-core'
  },
  {
    name: 'nestJs-template',
    desc: 'Production-ready NestJS boilerplate with Prisma, Docker, and CI/CD. Includes generic repositories, services, and module structure.',
    tech: 'TypeScript',
    url: 'https://github.com/JohnyYen/nestJs-template'
  },
  {
    name: 'fastapi-template',
    desc: 'FastAPI template with async SQLAlchemy, JWT auth, and Docker. Structured with Clean Architecture for scalable APIs.',
    tech: 'Python',
    url: 'https://github.com/JohnyYen/fastapi-template'
  },
  {
    name: 'hello-world-project',
    desc: 'Starter template for new projects. Quick bootstrap with essential configurations and folder structure.',
    tech: 'TypeScript',
    url: 'https://github.com/JohnyYen/hello-world-project'
  }
];

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
        '  projects     - Browse my pinned projects',
        '  skills       - View my technical skills',
        '  fetch        - Show system info (fastfetch-style)',
        '  cv          - Download my CV',
        '  social      - Social links',
        '  contact     - How to reach me',
        '  clear, cls  - Clear the terminal',
        '  whoami      - Display current user',
        '  date        - Show current date/time',
        '  echo        - Print text',
        '',
        'Tips:',
        '  - Use Tab for autocomplete',
        '  - Use ↑/↓ arrows for command history',
      ],
      type: 'stdout' as const
    })
  },
  {
    name: 'about',
    description: 'Learn about me',
    handler: () => ({
      output: [
        '═ ABOUT ──────────────────────────────────────────',
        '',
        '👋 Hi! I\'m Johny A. Pedraza Romero',
        '',
        '💼 Backend Engineer in Evolution',
        '   Currently focused on building robust APIs and exploring',
        '   software architecture patterns for scalable systems.',
        '',
        '🎯 Current Focus:',
        '   • Software Architecture - Designing maintainable',
        '     systems, understanding DDD, Clean Architecture,',
        '     and system design principles.',
        '   • AI Engineering - Learning ML integration, building',
        '     AI-powered features, and understanding LLM patterns.',
        '',
        '🔧 What I build:',
        '   • APIs with FastAPI & NestJS',
        '   • Developer templates & boilerplates',
        '   • Clean Architecture patterns',
        '',
        '📚 Learning Journey:',
        '   Currently diving deep into system design and exploring',
        '   how AI/ML can enhance developer productivity.',
        '   Open to architecture discussions and collaboration!',
        '',
        '→ Try "fetch" for a quick summary of me!',
      ],
      type: 'stdout' as const
    })
  },
  {
    name: 'fetch',
    description: 'Show quick system info (fastfetch-style)',
    handler: () => ({
      output: [
        DRAGON_ASCII,
        '',
        '╭───────────────────╮',
        '│   user@portfolio  │',
        '╰───────────────────╯',
        '',
        '  ┌─ Info',
        '  │  OS:      Terminal Portfolio v1.0',
        '  │  Host:    JohnyYen',
        '  │  Kernel:  React + Next.js',
        '  │  Shell:   Custom Terminal',
        '  │',
        '  ├─ Tech Stack',
        '  │  Backend:  Python (FastAPI), Node.js (NestJS)',
        '  │  Database: PostgreSQL, Prisma, SQLAlchemy',
        '  │  DevOps:   Docker, GitHub Actions',
        '  │',
        '  ├─ Currently Learning',
        '  │  • Software Architecture',
        '  │  • AI/ML Engineering',
        '  │',
        '  └─ Location',
        '     🌎 Available remotely',
        '',
        'Type "about" for more details!',
      ],
      type: 'stdout' as const
    }),
    aliases: ['neofetch', 'sysinfo']
  },
  {
    name: 'projects',
    description: 'Browse my pinned projects',
    handler: (args: string[]) => {
      const filter = args[0]?.toLowerCase();
      
      const filtered = filter 
        ? projects.filter(p => 
            p.tech.toLowerCase().includes(filter) ||
            p.name.toLowerCase().includes(filter)
          )
        : projects;
      
      return {
        output: [
          '═ PROJECTS ──────────────────────────────────────────',
          '',
          ...filtered.map(p => [
            `📦 ${p.name}`,
            `   ${p.desc}`,
            `   └─ ${p.tech}`,
            `   🔗 ${p.url}`,
            ''
          ].flat()).flat(),
          filter ? `Found ${filtered.length} project(s)` : '',
          filter && filtered.length === 0 ? `No projects matching "${filter}"` : '',
        ].filter(Boolean),
        type: 'stdout' as const
      };
    },
    aliases: ['work', 'repo']
  },
  {
    name: 'skills',
    description: 'View my technical skills',
    handler: () => ({
      output: [
        '═ SKILLS ──────────────────────────────────────────',
        '',
        'Backend:     Python (FastAPI) │ Node.js (NestJS)',
        'Database:    PostgreSQL │ Prisma │ SQLAlchemy',
        'DevOps:      Docker │ GitHub Actions',
        'Tools:       TypeScript │ Git │ Vim',
        '',
        '📚 Currently Learning:',
        '   • Software Architecture (DDD, Clean Architecture)',
        '   • AI/ML Integration (LLMs, embeddings, RAG)',
        '',
        '→ Check "fetch" for a quick overview!',
        '→ Check "projects" for my work!',
      ],
      type: 'stdout' as const
    })
  },
  {
    name: 'cv',
    description: 'Download my CV',
    handler: () => ({
      output: [
        '═ CV/RESUME ────────────────────────────────────────',
        '',
        '📥 Download: [CV not configured yet]',
        '   Set CV_URL in commands/index.ts to enable download',
        '',
        'Last updated: 2026',
        '',
        'Contents:',
        '  • Professional Summary',
        '  • Work Experience',
        '  • Skills & Technologies',
        '  • Projects',
        '  • Education',
      ],
      type: 'stdout' as const
    }),
    aliases: ['resume']
  },
  {
    name: 'social',
    description: 'Social links',
    handler: () => ({
      output: [
        '═ SOCIAL ───────────────────────────────────────────',
        '',
        '🐙 GitHub:    github.com/JohnyYen',
        '💼 LinkedIn:  linkedin.com/in/johnyyen',
        '📧 Email:    (available on request)',
        '',
      ],
      type: 'stdout' as const
    })
  },
  {
    name: 'contact',
    description: 'How to reach me',
    handler: () => ({
      output: [
        '═ CONTACT ──────────────────────────────────────────',
        '',
        '💬 Let\'s connect!',
        '',
        '📧 Email:    johny.dev@email.com',
        '💼 LinkedIn: linkedin.com/in/johnyyen',
        '🐙 GitHub:   github.com/JohnyYen',
        '',
        'Open for:',
        '  • Backend development opportunities',
        '  • Software architecture discussions',
        '  • AI/ML collaboration',
        '  • Tech mentorship',
        '',
        'Response: Usually within 48h',
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
        `${command}: command not found`,
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

// Export dragon ASCII for boot sequence
export const getDragonAscii = () => DRAGON_ASCII;