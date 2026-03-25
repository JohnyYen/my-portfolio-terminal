'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import Output from './output';
import Input from './input';
import Prompt from './prompt';
import { parseCommand, executeCommand, getAvailableCommands, CommandResult } from '../../commands/index';

interface OutputLine {
  type: 'stdout' | 'stderr' | 'stdin' | 'info' | 'success' | 'warning';
  content: string;
  timestamp: number;
}

interface TerminalProps {
  username?: string;
  hostname?: string;
  onReady?: () => void;
}

export default function Terminal({ 
  username = 'visitor', 
  hostname = 'portfolio',
  onReady 
}: TerminalProps) {
  const [outputLines, setOutputLines] = useState<OutputLine[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentPath] = useState('~');
  const [isReady, setIsReady] = useState(false);
  const [showBoot, setShowBoot] = useState(true);
  const terminalRef = useRef<HTMLDivElement>(null);

  const availableCommands = getAvailableCommands();

  // Add a line to output
  const addOutput = useCallback((type: OutputLine['type'], content: string) => {
    setOutputLines(prev => [
      ...prev,
      { type, content, timestamp: Date.now() }
    ]);
  }, []);

  // Handle command submission
  const handleCommand = useCallback((command: string) => {
    // Parse command first to check if it's clear
    const parsed = parseCommand(command);
    
    // Handle clear command - clear all output
    if (parsed.command === 'clear' || parsed.command === 'cls' || parsed.command === 'reset') {
      setOutputLines([]);
      setCommandHistory(prev => [...prev, command]);
      setHistoryIndex(-1);
      return;
    }

    // Add the command to output as input using Starship-style prompt
    addOutput('stdin', ''); // Empty line before command
    setCommandHistory(prev => [...prev, command]);
    setHistoryIndex(-1);

    // Execute command
    const result: CommandResult = executeCommand(parsed);

    // Add output
    if (result.output && result.output.length > 0) {
      result.output.forEach((line: string) => {
        addOutput(result.type || 'stdout', line);
      });
    }

    // Add small spacing after command output
    addOutput('stdout', '');
  }, [addOutput, username, hostname, currentPath]);

  // History navigation
  const getHistoryUp = useCallback(() => {
    if (commandHistory.length === 0) return null;
    
    const newIndex = historyIndex < 0 
      ? commandHistory.length - 1 
      : Math.max(0, historyIndex - 1);
    
    setHistoryIndex(newIndex);
    return commandHistory[newIndex];
  }, [commandHistory, historyIndex]);

  const getHistoryDown = useCallback(() => {
    if (commandHistory.length === 0 || historyIndex < 0) return null;
    
    const newIndex = historyIndex + 1;
    
    if (newIndex >= commandHistory.length) {
      setHistoryIndex(-1);
      return '';
    }
    
    setHistoryIndex(newIndex);
    return commandHistory[newIndex];
  }, [commandHistory, historyIndex]);

  // Boot sequence animation
  useEffect(() => {
    if (!isReady) {
      const bootMessages = [
        { type: 'info' as const, text: '[  OK  ] Reached target Graphical Interface', delay: 100 },
        { type: 'info' as const, text: '[  OK  ] Started Terminal Portfolio Service', delay: 200 },
        { type: 'info' as const, text: '[  OK  ] Loaded Starship Prompt Configuration', delay: 150 },
        { type: 'stdout' as const, text: '', delay: 100 },
        { type: 'stdout' as const, text: '  ╔═══════════════════════════════════════════════════════════╗', delay: 50 },
        { type: 'stdout' as const, text: '  ║                                                           ║', delay: 50 },
        { type: 'stdout' as const, text: '  ║   ████████╗███████╗██████╗ ███╗   ███╗██████╗ ██╗      ██████╗  ██████╗  ║', delay: 30 },
        { type: 'stdout' as const, text: '  ║   ╚══██╔══╝██╔════╝██╔══██╗████╗ ████║██╔══██╗██║     ██╔═══██╗██╔════╝  ║', delay: 30 },
        { type: 'stdout' as const, text: '  ║      ██║   █████╗  ██████╔╝██╔████╔██║██████╔╝██║     ██║   ██║██║  ███╗ ║', delay: 30 },
        { type: 'stdout' as const, text: '  ║      ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║██╔══██╗██║     ██║   ██║██║   ██║ ║', delay: 30 },
        { type: 'stdout' as const, text: '  ║      ██║   ███████╗██║  ██║██║ ╚═╝ ██║██████╔╝███████╗╚██████╔╝╚██████╔╝ ║', delay: 30 },
        { type: 'stdout' as const, text: '  ║      ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═════╝ ╚══════╝ ╚═════╝  ╚═════╝  ║', delay: 30 },
        { type: 'stdout' as const, text: '  ║                                                           ║', delay: 50 },
        { type: 'stdout' as const, text: '  ╚═══════════════════════════════════════════════════════════╝', delay: 50 },
        { type: 'stdout' as const, text: '', delay: 100 },
        { type: 'stdout' as const, text: '  Welcome to my Interactive Terminal Portfolio', delay: 100 },
        { type: 'stdout' as const, text: '  Type "help" to see available commands', delay: 100 },
        { type: 'stdout' as const, text: '  Use Tab for autocomplete • ↑↓ for history', delay: 100 },
        { type: 'stdout' as const, text: '', delay: 100 },
      ];

      let currentDelay = 0;
      bootMessages.forEach((msg) => {
        currentDelay += msg.delay;
        setTimeout(() => {
          addOutput(msg.type, msg.text);
        }, currentDelay);
      });

      setTimeout(() => {
        setIsReady(true);
        setShowBoot(false);
        onReady?.();
      }, currentDelay + 200);
    }
  }, [isReady, addOutput, onReady]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [outputLines]);

  // Focus terminal when clicked
  const handleTerminalClick = () => {
    const input = document.querySelector('input[aria-label="Terminal input"]') as HTMLInputElement;
    input?.focus();
  };

  return (
    <div 
      className="min-h-screen w-full bg-[var(--terminal-bg)] flex items-center justify-center p-4"
      onClick={handleTerminalClick}
    >
      {/* Terminal Window */}
      <div className="terminal-chrome w-full max-w-4xl h-[90vh] max-h-[800px] flex flex-col overflow-hidden animate-fade-in">
        {/* Terminal Header */}
        <div className="terminal-header flex items-center justify-between px-4 py-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            {/* Traffic lights */}
            <div className="flex gap-2 mr-4">
              <button className="traffic-light close" aria-label="Close" />
              <button className="traffic-light minimize" aria-label="Minimize" />
              <button className="traffic-light maximize" aria-label="Maximize" />
            </div>
            
            {/* Terminal title */}
            <span className="terminal-title flex items-center gap-2">
              <span className="text-[var(--starship-cyan)]">⌘</span>
              <span>{username}@{hostname}: {currentPath}</span>
            </span>
          </div>
          
          {/* Right side indicators */}
          <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
            <span className="flex items-center gap-1">
              <span className="text-[var(--starship-green)]">●</span>
              <span>Connected</span>
            </span>
          </div>
        </div>

        {/* Terminal Content */}
        <div 
          ref={terminalRef}
          className="flex-1 overflow-y-auto p-4 terminal-selectable"
        >
          {/* Output Lines */}
          <Output lines={outputLines} typingSpeed={3} />
          
          {/* Input Area - only show when ready */}
          {isReady && !showBoot && (
            <div className="terminal-input-container -mx-4 px-4 py-2 mt-2 animate-slide-up">
              <Input
                onSubmit={handleCommand}
                commands={availableCommands}
                commandHistory={commandHistory}
                onHistoryUp={getHistoryUp}
                onHistoryDown={getHistoryDown}
                promptComponent={
                  <Prompt 
                    username={username}
                    hostname={hostname}
                    currentPath={currentPath}
                  />
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
