'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Output from './output';
import Input from './input';
import { parseCommand, executeCommand, getAvailableCommands, CommandResult } from '../../commands/index';

interface OutputLine {
  type: 'stdout' | 'stderr' | 'stdin' | 'info';
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

    // Add the command to output as input
    addOutput('stdin', `${username}@${hostname}:${currentPath}$ ${command}`);
    
    // Add to history
    setCommandHistory(prev => [...prev, command]);
    setHistoryIndex(-1);

    // Execute command
    const result: CommandResult = executeCommand(parsed);

    // Add output
    if (result.output) {
      result.output.forEach((line: string) => {
        addOutput(result.type || 'stdout', line);
      });
    }

    // Add empty line after command
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

  // Initialize terminal
  useEffect(() => {
    if (!isReady) {
      // Welcome message
      addOutput('info', '╔══════════════════════════════════════════════════════════════════╗');
      addOutput('info', '║                                                                  ║');
      addOutput('info', '║   Welcome to my Terminal Portfolio                               ║');
      addOutput('info', '║   Type "help" to see available commands                          ║');
      addOutput('info', '║                                                                  ║');
      addOutput('info', '╚══════════════════════════════════════════════════════════════════╝');
      addOutput('stdout', '');
      
      setIsReady(true);
      onReady?.();
    }
  }, [isReady, addOutput, onReady]);

  // Focus terminal when clicked
  const handleTerminalClick = () => {
    const input = document.querySelector('input[aria-label="Terminal input"]') as HTMLInputElement;
    input?.focus();
  };

  return (
    <div 
      className="h-screen w-full bg-[#0a0a0a] text-[#00ff00] font-mono p-4 flex flex-col"
      onClick={handleTerminalClick}
    >
      <div className="flex-1 flex flex-col max-w-4xl w-full mx-auto">
        {/* Terminal header */}
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#333]">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#27ca3f]" />
          </div>
          <span className="text-[#888] ml-4">
            {username}@{hostname}: {currentPath}
          </span>
        </div>

        {/* Terminal content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Output lines={outputLines} typingSpeed={5} />
          
          {isReady && (
            <Input
              onSubmit={handleCommand}
              commands={availableCommands}
              commandHistory={commandHistory}
              onHistoryUp={getHistoryUp}
              onHistoryDown={getHistoryDown}
            />
          )}
        </div>
      </div>
    </div>
  );
}
