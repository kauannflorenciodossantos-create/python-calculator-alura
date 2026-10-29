import React from 'react';
import { motion } from 'motion/react';
import { Delete } from 'lucide-react';
import { ThemeMode } from '../types';

interface CalculatorKeypadProps {
  theme: ThemeMode;
  onDigit: (digit: string) => void;
  onOperator: (op: string) => void;
  onClear: () => void;
  onAllClear: () => void;
  onDelete: () => void;
  onToggleSign: () => void;
  onParenthesis: (p: '(' | ')') => void;
  onSpecialFunction: (func: string) => void;
  onEquals: () => void;
}

export const CalculatorKeypad: React.FC<CalculatorKeypadProps> = ({
  theme,
  onDigit,
  onOperator,
  onClear,
  onAllClear,
  onDelete,
  onToggleSign,
  onParenthesis,
  onSpecialFunction,
  onEquals,
}) => {
  // Styles for different key types
  const isDark = theme === 'dark';

  const baseKeyClass =
    'relative flex items-center justify-center font-medium rounded-xl select-none transition-all duration-150 active:scale-95 text-base sm:text-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 shadow-sm';

  const numKeyClass = `${baseKeyClass} h-13 sm:h-14 ${
    isDark
      ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-100 border border-slate-700/60'
      : 'bg-white hover:bg-slate-50 text-slate-900 border border-slate-200'
  }`;

  const opKeyClass = `${baseKeyClass} h-13 sm:h-14 font-mono font-semibold ${
    isDark
      ? 'bg-indigo-950/50 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-800/50'
      : 'bg-indigo-50/90 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80'
  }`;

  const funcKeyClass = `${baseKeyClass} h-13 sm:h-14 text-sm font-semibold ${
    isDark
      ? 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
      : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200'
  }`;

  const specialKeyClass = `${baseKeyClass} h-13 sm:h-14 text-xs sm:text-sm font-mono ${
    isDark
      ? 'bg-sky-950/40 hover:bg-sky-900/50 text-sky-300 border border-sky-800/40'
      : 'bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200'
  }`;

  const equalsKeyClass = `${baseKeyClass} h-13 sm:h-14 font-bold text-xl ${
    'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400/40'
  }`;

  return (
    <div className="flex flex-col gap-2 sm:gap-2.5 mt-3 sm:mt-4">
      {/* Quick Python Math Header Toolbar */}
      <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSpecialFunction('√')}
          className={specialKeyClass}
          title="Raiz quadrada (math.sqrt)"
        >
          √x
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onOperator('**')}
          className={specialKeyClass}
          title="Potência em Python (x ** y)"
        >
          xʸ
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onOperator('//')}
          className={specialKeyClass}
          title="Divisão inteira em Python (//)"
        >
          //
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onOperator('%')}
          className={specialKeyClass}
          title="Módulo / Resto da divisão (%)"
        >
          %
        </motion.button>
      </div>

      {/* Main Calculator Grid (5 Rows x 4 Cols) */}
      <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
        {/* Row 1: Clear, Backspace, Parentheses, Division */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAllClear}
          className={`${funcKeyClass} ${isDark ? 'text-rose-400' : 'text-rose-600'}`}
          title="Limpar tudo (All Clear - Esc)"
        >
          AC
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={onDelete}
          className={funcKeyClass}
          title="Apagar dígito (Backspace)"
          aria-label="Apagar dígito"
        >
          <Delete className="w-5 h-5" />
        </motion.button>
        <div className="grid grid-cols-2 gap-1">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onParenthesis('(')}
            className={`${funcKeyClass} px-0`}
            title="Abre parênteses"
          >
            (
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onParenthesis(')')}
            className={`${funcKeyClass} px-0`}
            title="Fecha parênteses"
          >
            )
          </motion.button>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onOperator('÷')}
          className={opKeyClass}
          title="Divisão (/)"
        >
          ÷
        </motion.button>

        {/* Row 2: 7, 8, 9, Multiplication */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onDigit('7')}
          className={numKeyClass}
        >
          7
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onDigit('8')}
          className={numKeyClass}
        >
          8
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onDigit('9')}
          className={numKeyClass}
        >
          9
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onOperator('×')}
          className={opKeyClass}
          title="Multiplicação (*)"
        >
          ×
        </motion.button>

        {/* Row 3: 4, 5, 6, Subtraction */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onDigit('4')}
          className={numKeyClass}
        >
          4
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onDigit('5')}
          className={numKeyClass}
        >
          5
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onDigit('6')}
          className={numKeyClass}
        >
          6
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onOperator('-')}
          className={opKeyClass}
          title="Subtração (-)"
        >
          -
        </motion.button>

        {/* Row 4: 1, 2, 3, Addition */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onDigit('1')}
          className={numKeyClass}
        >
          1
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onDigit('2')}
          className={numKeyClass}
        >
          2
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onDigit('3')}
          className={numKeyClass}
        >
          3
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onOperator('+')}
          className={opKeyClass}
          title="Adição (+)"
        >
          +
        </motion.button>

        {/* Row 5: ± (Sign), 0, Point, Equals */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleSign}
          className={funcKeyClass}
          title="Inverter sinal (+/-)"
        >
          ±
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onDigit('0')}
          className={numKeyClass}
        >
          0
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onDigit('.')}
          className={numKeyClass}
          title="Ponto decimal (.)"
        >
          .
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={onEquals}
          className={equalsKeyClass}
          title="Calcular resultado Python (Enter)"
        >
          =
        </motion.button>
      </div>
    </div>
  );
};
