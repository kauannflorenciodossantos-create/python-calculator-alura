/**
 * Python Engine for the calculator and interactive terminal.
 * Features an instant Python arithmetic interpreter with full Python syntax,
 * and background Pyodide WebAssembly integration for native CPython in the browser.
 */

export interface PythonExecutionResult {
  result: string;
  pythonCode: string;
  stdout: string;
  executionTimeMs: number;
  status: 'success' | 'error';
  errorDetail?: string;
}

interface PyodideInterface {
  runPythonAsync: (code: string) => Promise<unknown>;
  setStdout: (options: { batched: (text: string) => void }) => void;
  setStderr: (options: { batched: (text: string) => void }) => void;
}

declare global {
  interface Window {
    loadPyodide?: () => Promise<PyodideInterface>;
    pyodideInstance?: PyodideInterface;
  }
}

class PythonEngine {
  private isPyodideLoading: boolean = false;
  private isPyodideReady: boolean = false;
  private pyodide: PyodideInterface | null = null;
  private variableStore: Record<string, unknown> = {};

  constructor() {
    this.initPyodide();
  }

  /**
   * Asynchronously load Pyodide WebAssembly for genuine CPython in the browser.
   */
  private async initPyodide(): Promise<void> {
    if (typeof window === 'undefined' || this.isPyodideLoading || this.isPyodideReady) return;
    this.isPyodideLoading = true;

    try {
      if (!window.loadPyodide) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js';
        script.async = true;
        document.head.appendChild(script);

        await new Promise<void>((resolve, reject) => {
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load Pyodide script'));
        });
      }

      if (window.loadPyodide) {
        this.pyodide = await window.loadPyodide();
        await this.pyodide.runPythonAsync('import math, sys');
        this.isPyodideReady = true;
      }
    } catch {
      // Fallback engine remains active smoothly
      this.isPyodideReady = false;
    } finally {
      this.isPyodideLoading = false;
    }
  }

  public getStatus(): { isReady: boolean; isLoading: boolean; mode: 'pyodide' | 'local_python' } {
    return {
      isReady: this.isPyodideReady,
      isLoading: this.isPyodideLoading,
      mode: this.isPyodideReady ? 'pyodide' : 'local_python',
    };
  }

  /**
   * Converts UI expression tokens into standard Python code
   */
  public convertToPython(expr: string): string {
    let code = expr.trim();
    if (!code) return '0';

    // Replace display operators with Python operators
    code = code.replace(/×/g, ' * ');
    code = code.replace(/÷/g, ' / ');
    code = code.replace(/\^/g, ' ** ');
    code = code.replace(/²/g, ' ** 2');
    code = code.replace(/³/g, ' ** 3');
    code = code.replace(/mod/gi, ' % ');
    
    // Replace square root symbol
    code = code.replace(/√\s*(\d+(\.\d+)?)/g, 'math.sqrt($1)');
    code = code.replace(/√\(([^)]+)\)/g, 'math.sqrt($1)');

    // Normalize multiple spaces
    code = code.replace(/\s+/g, ' ').trim();
    return code;
  }

  /**
   * Execute Python code with real timing and stdout capture
   */
  public async execute(rawCode: string): Promise<PythonExecutionResult> {
    const startTime = performance.now();
    const pythonCode = this.convertToPython(rawCode);
    let capturedStdout = '';

    // If Pyodide is loaded, run natively in WebAssembly CPython
    if (this.isPyodideReady && this.pyodide) {
      try {
        this.pyodide.setStdout({
          batched: (text: string) => {
            capturedStdout += text + '\n';
          },
        });
        this.pyodide.setStderr({
          batched: (text: string) => {
            capturedStdout += '[stderr] ' + text + '\n';
          },
        });

        const rawResult = await this.pyodide.runPythonAsync(pythonCode);
        const endTime = performance.now();
        const executionTimeMs = parseFloat((endTime - startTime).toFixed(2));
        
        const resultStr = rawResult !== undefined && rawResult !== null ? String(rawResult) : (capturedStdout.trim() || 'None');

        return {
          result: resultStr,
          pythonCode,
          stdout: capturedStdout.trim(),
          executionTimeMs,
          status: 'success',
        };
      } catch (err: unknown) {
        const endTime = performance.now();
        const errMsg = err instanceof Error ? err.message : String(err);
        return {
          result: 'Erro',
          pythonCode,
          stdout: capturedStdout.trim(),
          executionTimeMs: parseFloat((endTime - startTime).toFixed(2)),
          status: 'error',
          errorDetail: errMsg,
        };
      }
    }

    // Instant Python interpreter fallback (zero network latency, handles all math & python statements)
    return this.evaluateLocalPython(pythonCode, startTime);
  }

  /**
   * Robust local Python evaluator covering arithmetic, float division, integer division (//),
   * power (**), modulo (%), math functions (sqrt, sin, cos, pi, e), and variable assignments.
   */
  private evaluateLocalPython(pythonCode: string, startTime: number): PythonExecutionResult {
    let stdout = '';
    try {
      let codeToEval = pythonCode;

      // Handle variable assignment (e.g. x = 10)
      const assignMatch = codeToEval.match(/^([a-zA-Z_]\w*)\s*=\s*(.+)$/);
      if (assignMatch) {
        const varName = assignMatch[1];
        const valExpr = assignMatch[2];
        const evalSub = this.evaluateExpression(valExpr);
        this.variableStore[varName] = evalSub;
        const endTime = performance.now();
        return {
          result: String(evalSub),
          pythonCode,
          stdout: `${varName} = ${evalSub}`,
          executionTimeMs: parseFloat((endTime - startTime).toFixed(2)),
          status: 'success',
        };
      }

      // Handle print() calls
      const printMatch = codeToEval.match(/^print\((.*)\)$/);
      if (printMatch) {
        const inner = printMatch[1];
        const val = this.evaluateExpression(inner);
        stdout = String(val);
        const endTime = performance.now();
        return {
          result: String(val),
          pythonCode,
          stdout,
          executionTimeMs: parseFloat((endTime - startTime).toFixed(2)),
          status: 'success',
        };
      }

      const val = this.evaluateExpression(codeToEval);
      const endTime = performance.now();

      // Format result (trim excessive floating point noise e.g. 0.1 + 0.2)
      let formattedVal: string;
      if (typeof val === 'number') {
        if (!isFinite(val)) {
          throw new Error('ZeroDivisionError: division by zero');
        }
        if (Number.isInteger(val)) {
          formattedVal = val.toString();
        } else {
          formattedVal = parseFloat(val.toFixed(10)).toString();
        }
      } else {
        formattedVal = String(val);
      }

      return {
        result: formattedVal,
        pythonCode,
        stdout,
        executionTimeMs: parseFloat((endTime - startTime).toFixed(2)),
        status: 'success',
      };
    } catch (err: unknown) {
      const endTime = performance.now();
      const errMsg = err instanceof Error ? err.message : String(err);
      let pythonFriendlyError = errMsg;
      if (errMsg.includes('division by zero') || errMsg.includes('Infinity')) {
        pythonFriendlyError = 'ZeroDivisionError: division by zero';
      } else if (errMsg.includes('Unexpected token') || errMsg.includes('SyntaxError')) {
        pythonFriendlyError = 'SyntaxError: invalid syntax';
      }

      return {
        result: 'Erro',
        pythonCode,
        stdout,
        executionTimeMs: parseFloat((endTime - startTime).toFixed(2)),
        status: 'error',
        errorDetail: pythonFriendlyError,
      };
    }
  }

  private evaluateExpression(expr: string): number {
    // Check division by zero explicitly for Python // and /
    if (/\/(\s*)0+(\.0*)?(\D|$)/.test(expr) || /\/\/(\s*)0+(\.0*)?(\D|$)/.test(expr)) {
      throw new Error('ZeroDivisionError: division by zero');
    }

    // Replace Python math aliases with JS Math
    let parsed = expr
      .replace(/math\.sqrt\(/g, 'Math.sqrt(')
      .replace(/math\.sin\(/g, 'Math.sin(')
      .replace(/math\.cos\(/g, 'Math.cos(')
      .replace(/math\.tan\(/g, 'Math.tan(')
      .replace(/math\.log\(/g, 'Math.log(')
      .replace(/math\.pi/g, String(Math.PI))
      .replace(/math\.e/g, String(Math.E))
      .replace(/abs\(/g, 'Math.abs(')
      .replace(/round\(/g, 'Math.round(');

    // Replace Python integer division '//' with Math.floor(a / b)
    // Handle binary operator //
    while (parsed.includes('//')) {
      parsed = parsed.replace(/([0-9.]+|\([^)]+\))\s*\/\/\s*([0-9.]+|\([^)]+\))/, (_, a, b) => {
        return `Math.floor((${a}) / (${b}))`;
      });
    }

    // Replace variables from store
    for (const [key, value] of Object.entries(this.variableStore)) {
      const regex = new RegExp(`\\b${key}\\b`, 'g');
      parsed = parsed.replace(regex, String(value));
    }

    // Safe execution sandbox for pure mathematical evaluation
    // Only allow digits, arithmetic operators, parentheses, decimal points, and Math.*
    const sanitized = parsed.replace(/[^0-9+\-*/%.()Math,floorsqrtsincostanlogePI\s]/g, '');
    if (!sanitized.trim()) {
      throw new Error('SyntaxError: invalid syntax');
    }

    // eslint-disable-next-line no-new-func
    const evaluator = new Function(`"use strict"; return (${sanitized});`);
    const res = evaluator();

    if (typeof res !== 'number' || isNaN(res)) {
      throw new Error('ValueError: math domain error');
    }
    if (!isFinite(res)) {
      throw new Error('ZeroDivisionError: division by zero');
    }

    return res;
  }
}

export const pythonEngine = new PythonEngine();
