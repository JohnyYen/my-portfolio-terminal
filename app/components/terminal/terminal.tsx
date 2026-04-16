'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import Output from './output';
import Input from './input';
import Prompt from './prompt';
import { parseCommand, executeCommand, getAvailableCommands } from '../../commands/index';

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
  const [currentCommand, setCurrentCommand] = useState('Terminal');
  const [isExecuting, setIsExecuting] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('terminalHistory');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed)) {
          setCommandHistory(parsed);
          setHistoryIndex(parsed.length); // Point to end (ready for new command)
        }
      } catch (e) {
        console.warn('Failed to parse terminal history from localStorage', e);
      }
    }
  }, []);

  // Save history to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('terminalHistory', JSON.stringify(commandHistory));
  }, [commandHistory]);

  const availableCommands = getAvailableCommands();

  const addOutput = useCallback((type: OutputLine['type'], content: string) => {
    setOutputLines(prev => [
      ...prev,
      { type, content, timestamp: Date.now() }
    ]);
  }, []);

    const handleCommand = useCallback(async (command: string) => {
  // Show processing indicator
  setIsExecuting(true);
  
  try {
    const parsed = parseCommand(command);
    
    // Check for clear command
    if (parsed.command === 'clear' || parsed.command === 'cls' || parsed.command === 'reset') {
      setOutputLines([]);
      setCommandHistory(prev => [...prev, command]);
      setHistoryIndex(-1);
      setCurrentCommand('Terminal');
      return;
    }
    
    // Check for exit command
    if (parsed.command === 'exit' || parsed.command === 'quit' || parsed.command === 'q') {
      setOutputLines([]);
      setCommandHistory(prev => [...prev, command]);
      const result = executeCommand(parsed);
      if (result.output) {
        result.output.forEach((line: string) => {
          addOutput(result.type || 'stdout', line);
        });
      }
      setCurrentCommand('Goodbye');
      return;
    }
    
    setCommandHistory(prev => [...prev, command]);
    setHistoryIndex(-1);
    
    const result: any = executeCommand(parsed);
    
    // Update window title with command
    setCurrentCommand(parsed.command || 'Terminal');
    
    // Handle clear flag from command result
    if (result.clearOutput) {
      setOutputLines([]);
    }
    
    if (result.output && result.output.length > 0) {
      result.output.forEach((line: string) => {
        addOutput(result.type || 'stdout', line);
      });
    }
    
    addOutput('stdout', '');
  } finally {
    // Hide processing indicator
    setIsExecuting(false);
  }
}, [addOutput]);

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

  // Update document title
  useEffect(() => {
    document.title = `${currentCommand} | Terminal Portfolio`;
  }, [currentCommand]);

  // Boot sequence - minimal, then clear
  useEffect(() => {
    if (!isReady) {
      const bootMessages = [
        { type: 'stdout' as const, text: 'Initializing terminal...', delay: 50 },
        { type: 'stdout' as const, text: 'Loading starship config...', delay: 100 },
        { type: 'success' as const, text: 'Ready', delay: 80 },
        { type: 'stdout' as const, text: '', delay: 30 },
        { type: 'info' as const, text: 'Type "help" for available commands', delay: 80 },
        { type: 'stdout' as const, text: '', delay: 30 },
      ];

      let currentDelay = 0;
      bootMessages.forEach((msg) => {
        currentDelay += msg.delay;
        setTimeout(() => {
          addOutput(msg.type, msg.text);
        }, currentDelay);
      });

      // Clear boot messages after completion, show only prompt
      setTimeout(() => {
        setOutputLines([]);
        setIsReady(true);
        onReady?.();
      }, currentDelay + 150);
    }
  }, [isReady, addOutput, onReady]);

  // Auto-scroll
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [outputLines]);

  const handleTerminalClick = () => {
    const input = document.querySelector('input[aria-label="Terminal input"]') as HTMLInputElement;
    input?.focus();
  };

  return (
    <div 
      className="h-screen w-full bg-[var(--terminal-bg)] flex flex-col"
      onClick={handleTerminalClick}
    >
      {/* Terminal Window - macOS style */}
      <div className="terminal-window flex-1">
        {/* Terminal Header - macOS style */}
        <div className="terminal-header">
          {/* Traffic lights */}
          <div className="flex items-center gap-2.5">
            <button 
              className="traffic-light close" 
              aria-label="Close"
              onClick={(e) => e.preventDefault()}
            />
            <button 
              className="traffic-light minimize" 
              aria-label="Minimize"
              onClick={(e) => e.preventDefault()}
            />
            <button 
              className="traffic-light maximize" 
              aria-label="Maximize"
              onClick={(e) => e.preventDefault()}
            />
          </div>
          
          {/* Terminal title */}
          <div className="terminal-title">
            <span style={{ color: 'var(--starship-cyan)' }}>⌘</span>
            <span>{username}@{hostname}: {currentPath}</span>
            {isExecuting && (
              <span className="ml-2 animate-spin text-[var(--starship-green)] text-xs">
                ●
              </span>
            )}
          </div>
          
          {/* Spacer for centering */}
          <div className="w-14" />
        </div>
        
        {/* Terminal Content */}
        <div 
          ref={terminalRef}
          className="flex-1 overflow-y-auto p-0"
        >
          <div className="p-4">
            <Output lines={outputLines} typingSpeed={2} />
            
            {/* Input area */}
            {isReady && (
              <div className="terminal-input-container mt-1">
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
    </div>
  );
}