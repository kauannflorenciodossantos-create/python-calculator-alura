import React, { useState } from 'react';
import { X, Copy, Check, Download, FileCode, Play } from 'lucide-react';
import { ThemeMode } from '../types';

interface PythonCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
  onRunTestInTerminal: () => void;
}

const PYTHON_SOURCE_CODE = `#!/usr/bin/env python3
"""
PyCalc Studio - Motor de Cálculo em Python
==========================================
Módulo central com operações aritméticas, divisão inteira,
potência, raiz quadrada e avaliação segura via AST do Python.
"""

import ast
import math
import operator
import sys
from typing import Any, Dict, List, Union


class PythonCalculator:
    """Calculadora orientada a objetos com histórico e tratamento de erros."""

    SUPPORTED_OPERATORS: Dict[type, Any] = {
        ast.Add: operator.add,
        ast.Sub: operator.sub,
        ast.Mult: operator.mul,
        ast.Div: operator.truediv,
        ast.FloorDiv: operator.floordiv,
        ast.Mod: operator.mod,
        ast.Pow: operator.pow,
        ast.USub: operator.neg,
        ast.UAdd: operator.pos,
    }

    MATH_FUNCTIONS: Dict[str, Any] = {
        'sqrt': math.sqrt,
        'sin': math.sin,
        'cos': math.cos,
        'tan': math.tan,
        'log': math.log,
        'abs': abs,
        'round': round,
        'pow': pow,
        'pi': math.pi,
        'e': math.e,
    }

    def __init__(self) -> None:
        self.history: List[Dict[str, Any]] = []

    def add(self, a: float, b: float) -> float:
        return a + b

    def subtract(self, a: float, b: float) -> float:
        return a - b

    def multiply(self, a: float, b: float) -> float:
        return a * b

    def divide(self, a: float, b: float) -> float:
        if b == 0:
            raise ZeroDivisionError("Divisão por zero não é permitida.")
        return a / b

    def int_divide(self, a: float, b: float) -> int:
        """Divisão inteira típica do Python (//)"""
        if b == 0:
            raise ZeroDivisionError("Divisão inteira por zero não é permitida.")
        return int(a // b)

    def power(self, a: float, b: float) -> float:
        """Potência (**)"""
        return a ** b

    def modulo(self, a: float, b: float) -> float:
        """Resto da divisão (%)"""
        if b == 0:
            raise ZeroDivisionError("Módulo por zero não é permitido.")
        return a % b

    def square_root(self, a: float) -> float:
        """Raiz quadrada (math.sqrt)"""
        if a < 0:
            raise ValueError("Não é possível calcular raiz quadrada de número negativo.")
        return math.sqrt(a)

    def evaluate(self, expression: str) -> Union[int, float]:
        """Avaliação segura via AST do Python."""
        tree = ast.parse(expression, mode='eval')
        return self._eval_node(tree.body)

    def _eval_node(self, node: ast.AST) -> Any:
        if isinstance(node, ast.Constant):
            return node.value
        elif isinstance(node, ast.BinOp):
            left = self._eval_node(node.left)
            right = self._eval_node(node.right)
            return self.SUPPORTED_OPERATORS[type(node.op)](left, right)
        elif isinstance(node, ast.UnaryOp):
            operand = self._eval_node(node.operand)
            return self.SUPPORTED_OPERATORS[type(node.op)](operand)
        elif isinstance(node, ast.Call):
            func_name = node.func.id if isinstance(node.func, ast.Name) else node.func.attr
            args = [self._eval_node(arg) for arg in node.args]
            return self.MATH_FUNCTIONS[func_name](*args)
        raise TypeError(f"Operação não permitida: {type(node).__name__}")
`;

export const PythonCodeModal: React.FC<PythonCodeModalProps> = ({
  isOpen,
  onClose,
  theme,
  onRunTestInTerminal,
}) => {
  const [copied, setCopied] = useState(false);
  const isDark = theme === 'dark';

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(PYTHON_SOURCE_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const handleDownload = () => {
    const blob = new Blob([PYTHON_SOURCE_CODE], { type: 'text/x-python;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'calculator.py';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`w-full max-w-3xl max-h-[85vh] rounded-2xl border flex flex-col shadow-2xl overflow-hidden transition-all ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Modal Header */}
        <div className={`p-4 border-b flex items-center justify-between gap-3 ${
          isDark ? 'border-slate-800 bg-slate-950/40' : 'border-slate-200 bg-slate-50'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm">calculator.py</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Python 3.12 Nativo
                </span>
              </div>
              <p className="text-xs text-slate-400">Código Python salvo no repositório do projeto</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onRunTestInTerminal}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
              title="Testar no Terminal"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Executar Teste</span>
            </button>
            <button
              onClick={handleCopy}
              className={`p-1.5 rounded-lg text-xs border transition-colors ${
                isDark
                  ? 'border-slate-800 text-slate-300 hover:bg-slate-800'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
              title="Copiar código"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={handleDownload}
              className={`p-1.5 rounded-lg text-xs border transition-colors ${
                isDark
                  ? 'border-slate-800 text-slate-300 hover:bg-slate-800'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
              title="Baixar arquivo calculator.py"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                isDark ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Code Body */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-950 font-mono text-xs text-slate-300 leading-relaxed select-text">
          <pre className="overflow-x-auto whitespace-pre">{PYTHON_SOURCE_CODE}</pre>
        </div>

        {/* Modal Footer Note */}
        <div className={`p-3 border-t text-[11px] flex items-center justify-between text-slate-400 ${
          isDark ? 'border-slate-800 bg-slate-950/50' : 'border-slate-200 bg-slate-50'
        }`}>
          <span>Localização no projeto: <code className="text-indigo-400 font-semibold">/calculator.py</code> e <code className="text-indigo-400 font-semibold">/test_calculator.py</code></span>
          <span>Compatível com CLI e WebAssembly</span>
        </div>
      </div>
    </div>
  );
};
