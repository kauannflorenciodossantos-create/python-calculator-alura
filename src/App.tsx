/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { CalculatorDisplay } from './components/CalculatorDisplay';
import { CalculatorKeypad } from './components/CalculatorKeypad';
import { HistorySidebar } from './components/HistorySidebar';
import { TerminalOutput } from './components/TerminalOutput';
import { PythonCodeModal } from './components/PythonCodeModal';
import { pythonEngine } from './services/pythonEngine';
import { soundService } from './services/soundService';
import { CalculationRecord, TerminalLog, ThemeMode } from './types';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('pycalc_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        return 'light';
      }
    } catch {}
    return 'dark';
  });

  // Sound state
  const [isMuted, setIsMuted] = useState<boolean>(() => soundService.getMuted());
  const [volume, setVolume] = useState<number>(() => soundService.getVolume());

  // Panel toggles
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);
  const [isTerminalOpen, setIsTerminalOpen] = useState(true);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);

  // Calculator state
  const [expression, setExpression] = useState<string>('');
  const [displayResult, setDisplayResult] = useState<string>('0');
  const [isError, setIsError] = useState(false);
  const [justCalculated, setJustCalculated] = useState(false);

  // History state
  const [history, setHistory] = useState<CalculationRecord[]>(() => {
    try {
      const saved = localStorage.getItem('pycalc_history');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  // Terminal state
  const [terminalLogs, setTerminalLogs] = useState<TerminalLog[]>([
    {
      id: 'init-1',
      type: 'system',
      text: 'Python 3.12 Interactive Session iniciada.',
      timestamp: Date.now(),
    },
    {
      id: 'init-2',
      type: 'system',
      text: 'Módulos carregados: math, sys. Funções disponíveis: sqrt, pow, sin, cos, pi, e.',
      timestamp: Date.now(),
    },
  ]);

  const [pyodideStatus, setPyodideStatus] = useState(pythonEngine.getStatus());

  // Check pyodide status
  useEffect(() => {
    const timer = setInterval(() => {
      setPyodideStatus(pythonEngine.getStatus());
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('pycalc_history', JSON.stringify(history));
    } catch {}
  }, [history]);

  // Apply theme to document
  useEffect(() => {
    try {
      localStorage.setItem('pycalc_theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.body.className = 'bg-slate-950 text-slate-100 antialiased';
      } else {
        document.documentElement.classList.remove('dark');
        document.body.className = 'bg-slate-100 text-slate-900 antialiased';
      }
    } catch {}
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleMute = () => {
    const newMute = soundService.toggleMute();
    setIsMuted(newMute);
  };

  const handleVolumeChange = (newVol: number) => {
    soundService.setVolume(newVol);
    setVolume(newVol);
  };

  // Convert current expression to Python syntax for display
  const currentPythonSyntax = expression ? pythonEngine.convertToPython(expression) : '';

  /**
   * Append digit or decimal point
   */
  const handleDigit = useCallback(
    (digit: string) => {
      soundService.playDigit(digit);
      setIsError(false);

      if (justCalculated) {
        setExpression(digit);
        setDisplayResult(digit);
        setJustCalculated(false);
        return;
      }

      setExpression((prev) => {
        // Prevent multiple consecutive decimals in the same number segment
        if (digit === '.') {
          const parts = prev.split(/[\s+\-×÷/%^()]+/);
          const currentPart = parts[parts.length - 1] || '';
          if (currentPart.includes('.')) return prev;
          if (!prev || /[\s+\-×÷/%^()]$/.test(prev)) {
            const next = prev + '0.';
            setDisplayResult(next);
            return next;
          }
        }

        const next = prev === '0' && digit !== '.' ? digit : prev + digit;
        setDisplayResult(next);
        return next;
      });
    },
    [justCalculated]
  );

  /**
   * Append arithmetic or Python operator
   */
  const handleOperator = useCallback(
    (op: string) => {
      soundService.playOperator();
      setIsError(false);

      setExpression((prev) => {
        let base = prev;
        if (justCalculated) {
          base = displayResult;
          setJustCalculated(false);
        }

        if (!base && op !== '-') {
          return '0 ' + op + ' ';
        }

        // If ends with another operator, replace it
        if (/(\s[+×÷\-/%]\s|\s\/\/\s|\s\*\*\s)$/.test(base)) {
          return base.replace(/(\s[+×÷\-/%]\s|\s\/\/\s|\s\*\*\s)$/, ` ${op} `);
        }

        return `${base} ${op} `;
      });
    },
    [justCalculated, displayResult]
  );

  /**
   * Append parentheses
   */
  const handleParenthesis = useCallback(
    (p: '(' | ')') => {
      soundService.playSpecial();
      setIsError(false);

      if (justCalculated) {
        setExpression(p);
        setDisplayResult(p);
        setJustCalculated(false);
        return;
      }

      setExpression((prev) => {
        const next = prev + p;
        setDisplayResult(next);
        return next;
      });
    },
    [justCalculated]
  );

  /**
   * Special math functions (e.g. square root)
   */
  const handleSpecialFunction = useCallback(
    (func: string) => {
      soundService.playSpecial();
      setIsError(false);

      if (func === '√') {
        setExpression((prev) => {
          if (!prev || justCalculated) {
            setJustCalculated(false);
            return '√( ';
          }
          return `${prev} × √( `;
        });
      }
    },
    [justCalculated]
  );

  /**
   * Invert sign (+/-)
   */
  const handleToggleSign = useCallback(() => {
    soundService.playSpecial();
    setExpression((prev) => {
      if (!prev || prev === '0') return prev;
      // If ends with a number, wrap or toggle negative
      const match = prev.match(/(-?\d+(\.\d+)?)$/);
      if (match) {
        const num = match[1];
        const inverted = num.startsWith('-') ? num.slice(1) : `-${num}`;
        return prev.slice(0, prev.length - num.length) + inverted;
      }
      return prev;
    });
  }, []);

  /**
   * Clear current expression
   */
  const handleClear = useCallback(() => {
    soundService.playClear();
    setExpression('');
    setDisplayResult('0');
    setIsError(false);
    setJustCalculated(false);
  }, []);

  /**
   * All Clear
   */
  const handleAllClear = useCallback(() => {
    soundService.playClear();
    setExpression('');
    setDisplayResult('0');
    setIsError(false);
    setJustCalculated(false);
  }, []);

  /**
   * Delete / Backspace
   */
  const handleDelete = useCallback(() => {
    soundService.playDelete();
    if (justCalculated) {
      handleClear();
      return;
    }
    setExpression((prev) => {
      if (!prev) return '';
      // If ends with spaced operator like ' + ', remove 3 chars
      let next = prev;
      if (/\s[+×÷\-/%]\s$/.test(prev)) {
        next = prev.slice(0, -3);
      } else if (/\s(\/\/|\*\*)\s$/.test(prev)) {
        next = prev.slice(0, -4);
      } else {
        next = prev.slice(0, -1);
      }
      setDisplayResult(next || '0');
      return next;
    });
  }, [justCalculated, handleClear]);

  /**
   * Evaluate the calculation using the Python Engine
   */
  const handleEquals = useCallback(async () => {
    const rawExpr = expression.trim();
    if (!rawExpr) return;

    try {
      const execResult = await pythonEngine.execute(rawExpr);

      if (execResult.status === 'success') {
        soundService.playEquals();
        setDisplayResult(execResult.result);
        setIsError(false);
        setJustCalculated(true);

        // Record in history
        const record: CalculationRecord = {
          id: `calc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          expression: rawExpr,
          result: execResult.result,
          pythonCode: execResult.pythonCode,
          timestamp: Date.now(),
          executionTimeMs: execResult.executionTimeMs,
          status: 'success',
        };
        setHistory((prev) => [record, ...prev.slice(0, 49)]);

        // Stream into Terminal
        setTerminalLogs((prev) => [
          ...prev,
          {
            id: `cmd-${Date.now()}-in`,
            type: 'input',
            text: execResult.pythonCode,
            timestamp: Date.now(),
          },
          {
            id: `cmd-${Date.now()}-out`,
            type: 'output',
            text: execResult.stdout ? `${execResult.stdout} -> ${execResult.result}` : execResult.result,
            timestamp: Date.now(),
            executionTimeMs: execResult.executionTimeMs,
          },
        ]);
      } else {
        soundService.playError();
        setDisplayResult('Erro');
        setIsError(true);
        setJustCalculated(true);

        setTerminalLogs((prev) => [
          ...prev,
          {
            id: `cmd-${Date.now()}-in`,
            type: 'input',
            text: execResult.pythonCode,
            timestamp: Date.now(),
          },
          {
            id: `cmd-${Date.now()}-err`,
            type: 'error',
            text: execResult.errorDetail || 'Traceback (most recent call last): SyntaxError: invalid syntax',
            timestamp: Date.now(),
            executionTimeMs: execResult.executionTimeMs,
          },
        ]);
      }
    } catch {
      soundService.playError();
      setDisplayResult('Erro');
      setIsError(true);
    }
  }, [expression]);

  /**
   * Execute arbitrary Python command from the terminal
   */
  const handleExecutePythonCommand = async (cmd: string) => {
    soundService.playOperator();
    const execResult = await pythonEngine.execute(cmd);

    if (execResult.status === 'success') {
      soundService.playEquals();
      setDisplayResult(execResult.result);
      setExpression(cmd);
      setJustCalculated(true);

      const record: CalculationRecord = {
        id: `term-${Date.now()}`,
        expression: cmd,
        result: execResult.result,
        pythonCode: execResult.pythonCode,
        timestamp: Date.now(),
        executionTimeMs: execResult.executionTimeMs,
        status: 'success',
      };
      setHistory((prev) => [record, ...prev.slice(0, 49)]);

      setTerminalLogs((prev) => [
        ...prev,
        {
          id: `t-in-${Date.now()}`,
          type: 'input',
          text: cmd,
          timestamp: Date.now(),
        },
        {
          id: `t-out-${Date.now()}`,
          type: 'output',
          text: execResult.stdout ? `${execResult.stdout}\nOut: ${execResult.result}` : `Out: ${execResult.result}`,
          timestamp: Date.now(),
          executionTimeMs: execResult.executionTimeMs,
        },
      ]);
    } else {
      soundService.playError();
      setTerminalLogs((prev) => [
        ...prev,
        {
          id: `t-in-${Date.now()}`,
          type: 'input',
          text: cmd,
          timestamp: Date.now(),
        },
        {
          id: `t-err-${Date.now()}`,
          type: 'error',
          text: execResult.errorDetail || 'Erro ao executar comando Python.',
          timestamp: Date.now(),
          executionTimeMs: execResult.executionTimeMs,
        },
      ]);
    }
  };

  /**
   * Global Keyboard Shortcuts handler
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input or textarea
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        handleDigit(e.key);
      } else if (e.key === '.') {
        e.preventDefault();
        handleDigit('.');
      } else if (e.key === '+') {
        e.preventDefault();
        handleOperator('+');
      } else if (e.key === '-') {
        e.preventDefault();
        handleOperator('-');
      } else if (e.key === '*') {
        e.preventDefault();
        handleOperator('×');
      } else if (e.key === '/') {
        e.preventDefault();
        handleOperator('÷');
      } else if (e.key === '%') {
        e.preventDefault();
        handleOperator('%');
      } else if (e.key === '^') {
        e.preventDefault();
        handleOperator('**');
      } else if (e.key === '(' || e.key === ')') {
        e.preventDefault();
        handleParenthesis(e.key);
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleEquals();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleDelete();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleAllClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    handleDigit,
    handleOperator,
    handleParenthesis,
    handleEquals,
    handleDelete,
    handleAllClear,
  ]);

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-200 ${
        theme === 'dark'
          ? 'bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white'
          : 'bg-slate-100/70 text-slate-900 selection:bg-indigo-200 selection:text-indigo-900'
      }`}
    >
      {/* Top Bar with Brand, Audio and Dark/Light controls */}
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        isMuted={isMuted}
        onToggleMute={toggleMute}
        volume={volume}
        onChangeVolume={handleVolumeChange}
        isHistoryOpen={isHistoryOpen}
        onToggleHistory={() => setIsHistoryOpen(!isHistoryOpen)}
        isTerminalOpen={isTerminalOpen}
        onToggleTerminal={() => setIsTerminalOpen(!isTerminalOpen)}
        onResetAll={handleAllClear}
        onOpenPythonCode={() => setIsCodeModalOpen(true)}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Calculator Card */}
          <div
            className={`flex flex-col transition-all duration-200 ${
              isHistoryOpen ? 'lg:col-span-7 xl:col-span-8' : 'lg:col-span-12'
            }`}
          >
            <div
              className={`rounded-3xl p-5 sm:p-7 border backdrop-blur-2xl transition-all duration-200 shadow-xl ${
                theme === 'dark'
                  ? 'bg-slate-900/60 border-slate-800/80 shadow-slate-950/50 ring-1 ring-white/5'
                  : 'bg-white/90 border-slate-200/90 shadow-slate-200/60 ring-1 ring-slate-900/5'
              }`}
            >
              {/* Calculator Header Label */}
              <div className="flex items-center justify-between mb-4 px-1 text-xs">
                <span
                  className={`font-semibold tracking-wider uppercase text-[11px] ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  Calculadora Científica Python
                </span>
                <span
                  className={`font-mono text-[11px] ${
                    theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
                  }`}
                >
                  precisão de ponto flutuante
                </span>
              </div>

              {/* Display Component */}
              <CalculatorDisplay
                expression={expression}
                result={displayResult}
                pythonSyntax={currentPythonSyntax}
                isError={isError}
                theme={theme}
                onClear={handleClear}
              />

              {/* Keypad Component */}
              <CalculatorKeypad
                theme={theme}
                onDigit={handleDigit}
                onOperator={handleOperator}
                onClear={handleClear}
                onAllClear={handleAllClear}
                onDelete={handleDelete}
                onToggleSign={handleToggleSign}
                onParenthesis={handleParenthesis}
                onSpecialFunction={handleSpecialFunction}
                onEquals={handleEquals}
              />
            </div>
          </div>

          {/* History Sidebar Panel */}
          {isHistoryOpen && (
            <div className="lg:col-span-5 xl:col-span-4 h-[580px] sm:h-[620px]">
              <HistorySidebar
                history={history}
                theme={theme}
                onClearHistory={() => setHistory([])}
                onSelectResult={(res) => {
                  soundService.playDigit();
                  setDisplayResult(res);
                  setExpression(res);
                  setJustCalculated(true);
                }}
                onSelectExpression={(expr) => {
                  soundService.playOperator();
                  setExpression(expr);
                  setDisplayResult(expr);
                  setJustCalculated(false);
                }}
              />
            </div>
          )}
        </div>

        {/* Real-time Python Terminal Section */}
        {isTerminalOpen && (
          <section className="w-full">
            <TerminalOutput
              logs={terminalLogs}
              theme={theme}
              onClearLogs={() =>
                setTerminalLogs([
                  {
                    id: `clear-${Date.now()}`,
                    type: 'system',
                    text: 'Terminal limpo. Sessão Python pronta.',
                    timestamp: Date.now(),
                  },
                ])
              }
              onExecutePythonCommand={handleExecutePythonCommand}
              pyodideStatus={pyodideStatus}
            />
          </section>
        )}
      </main>

      {/* Python Code Viewer Modal */}
      <PythonCodeModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
        theme={theme}
        onRunTestInTerminal={() => {
          setIsCodeModalOpen(false);
          setIsTerminalOpen(true);
          handleExecutePythonCommand('import math; [x**2 for x in range(1, 6)]');
        }}
      />
    </div>
  );
}
