#!/usr/bin/env python3
"""
PyCalc Studio - Motor de Cálculo em Python
==========================================
Este módulo implementa a lógica central da calculadora em Python nativo,
incluindo operações básicas, operadores avançados e avaliação segura de expressões.
"""

import ast
import math
import operator
import sys
from typing import Any, Dict, List, Union


class PythonCalculator:
    """Calculadora moderna orientada a objetos com histórico e tratamento de erros."""

    # Mapeamento de operadores suportados via AST do Python
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

    # Funções matemáticas permitidas
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
        """Adição: a + b"""
        return a + b

    def subtract(self, a: float, b: float) -> float:
        """Subtração: a - b"""
        return a - b

    def multiply(self, a: float, b: float) -> float:
        """Multiplicação: a * b"""
        return a * b

    def divide(self, a: float, b: float) -> float:
        """Divisão padrão em ponto flutuante: a / b"""
        if b == 0:
            raise ZeroDivisionError("Divisão por zero não é permitida.")
        return a / b

    def int_divide(self, a: float, b: float) -> int:
        """Divisão inteira típica do Python: a // b"""
        if b == 0:
            raise ZeroDivisionError("Divisão inteira por zero não é permitida.")
        return int(a // b)

    def power(self, a: float, b: float) -> float:
        """Exponenciação: a ** b"""
        return a ** b

    def modulo(self, a: float, b: float) -> float:
        """Resto da divisão: a % b"""
        if b == 0:
            raise ZeroDivisionError("Módulo por zero não é permitido.")
        return a % b

    def square_root(self, a: float) -> float:
        """Raiz quadrada: sqrt(a)"""
        if a < 0:
            raise ValueError("Não é possível calcular a raiz quadrada de um número negativo no conjunto real.")
        return math.sqrt(a)

    def evaluate(self, expression: str) -> Union[int, float]:
        """
        Avalia com segurança expressões matemáticas em sintaxe pura de Python
        utilizando a árvore de sintaxe abstrata (AST).
        """
        expression = expression.strip()
        if not expression:
            return 0

        # Normaliza símbolos comuns de interface para sintaxe Python
        expression = expression.replace('×', '*').replace('÷', '/').replace('^', '**')

        try:
            tree = ast.parse(expression, mode='eval')
            result = self._eval_node(tree.body)

            # Armazena no histórico interno
            self.history.append({
                'expression': expression,
                'result': result,
            })

            # Converte números inteiros para int (ex: 4.0 -> 4)
            if isinstance(result, float) and result.is_integer():
                return int(result)
            return result
        except ZeroDivisionError as zde:
            raise ZeroDivisionError("ZeroDivisionError: division by zero") from zde
        except Exception as e:
            raise ValueError(f"SyntaxError: {str(e)}") from e

    def _eval_node(self, node: ast.AST) -> Any:
        """Avalia nós individuais da árvore AST de forma recursiva e segura."""
        if isinstance(node, ast.Constant):  # Python 3.8+ (números)
            return node.value
        elif isinstance(node, ast.Num):  # Compatibilidade legada
            return node.n
        elif isinstance(node, ast.BinOp):
            op_type = type(node.op)
            if op_type not in self.SUPPORTED_OPERATORS:
                raise TypeError(f"Operador binário não suportado: {op_type.__name__}")
            left = self._eval_node(node.left)
            right = self._eval_node(node.right)
            if op_type in (ast.Div, ast.FloorDiv, ast.Mod) and right == 0:
                raise ZeroDivisionError("division by zero")
            return self.SUPPORTED_OPERATORS[op_type](left, right)
        elif isinstance(node, ast.UnaryOp):
            op_type = type(node.op)
            if op_type not in self.SUPPORTED_OPERATORS:
                raise TypeError(f"Operador unário não suportado: {op_type.__name__}")
            operand = self._eval_node(node.operand)
            return self.SUPPORTED_OPERATORS[op_type](operand)
        elif isinstance(node, ast.Call):
            # Chamadas como math.sqrt(x) ou sqrt(x)
            func_name = ''
            if isinstance(node.func, ast.Name):
                func_name = node.func.id
            elif isinstance(node.func, ast.Attribute) and isinstance(node.func.value, ast.Name):
                func_name = node.func.attr

            if func_name in self.MATH_FUNCTIONS:
                args = [self._eval_node(arg) for arg in node.args]
                return self.MATH_FUNCTIONS[func_name](*args)
            raise NameError(f"Função '{func_name}' não é permitida ou não existe.")
        elif isinstance(node, ast.Name):
            if node.id in self.MATH_FUNCTIONS:
                return self.MATH_FUNCTIONS[node.id]
            raise NameError(f"Variável ou identificador '{node.id}' não definido.")
        else:
            raise TypeError(f"Expressão ou comando não suportado: {type(node).__name__}")


def main() -> None:
    """Interface CLI interativa quando executado diretamente com 'python3 calculator.py'."""
    calc = PythonCalculator()
    print("==================================================")
    print("  PyCalc Studio - Terminal Python Nativo v3.12   ")
    print("==================================================")
    print("Exemplos de entrada: '10 + 5 * 2', '2**10', 'sqrt(144)', '15 // 4'")
    print("Digite 'sair' ou 'exit' para encerrar.\n")

    if len(sys.argv) > 1:
        # Modo de comando direto: python3 calculator.py "expressão"
        expr = " ".join(sys.argv[1:])
        try:
            res = calc.evaluate(expr)
            print(f">>> {expr}")
            print(f"Resultado: {res}")
        except Exception as e:
            print(f"Erro: {e}")
        return

    # Modo REPL interativo
    while True:
        try:
            user_input = input("pycalc >>> ").strip()
            if not user_input:
                continue
            if user_input.lower() in ('sair', 'exit', 'quit', 'q'):
                print("Encerrando PyCalc Studio. Até logo!")
                break
            res = calc.evaluate(user_input)
            print(f"Out: {res}")
        except (KeyboardInterrupt, EOFError):
            print("\nSessão encerrada.")
            break
        except Exception as err:
            print(f"Erro: {err}")


if __name__ == '__main__':
    main()
