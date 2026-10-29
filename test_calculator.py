#!/usr/bin/env python3
"""
Testes Unitários para a Calculadora Python (PyCalc Studio)
"""

import unittest
from calculator import PythonCalculator


class TestPythonCalculator(unittest.TestCase):
    def setUp(self):
        self.calc = PythonCalculator()

    def test_basic_addition(self):
        self.assertEqual(self.calc.evaluate("15 + 30"), 45)
        self.assertEqual(self.calc.evaluate("0.1 + 0.2"), 0.30000000000000004)

    def test_subtraction(self):
        self.assertEqual(self.calc.evaluate("100 - 35"), 65)
        self.assertEqual(self.calc.evaluate("-5 - 10"), -15)

    def test_multiplication(self):
        self.assertEqual(self.calc.evaluate("12 * 8"), 96)
        self.assertEqual(self.calc.evaluate("2.5 * 4"), 10)

    def test_division(self):
        self.assertEqual(self.calc.evaluate("100 / 4"), 25)
        self.assertEqual(self.calc.evaluate("7 / 2"), 3.5)

    def test_division_by_zero(self):
        with self.assertRaises(ZeroDivisionError):
            self.calc.evaluate("50 / 0")

    def test_integer_division(self):
        self.assertEqual(self.calc.evaluate("17 // 3"), 5)

    def test_power(self):
        self.assertEqual(self.calc.evaluate("2 ** 10"), 1024)
        self.assertEqual(self.calc.evaluate("5 ** 3"), 125)

    def test_modulo(self):
        self.assertEqual(self.calc.evaluate("29 % 5"), 4)

    def test_sqrt(self):
        self.assertEqual(self.calc.evaluate("sqrt(144)"), 12)
        self.assertEqual(self.calc.evaluate("sqrt(2)"), 1.4142135623730951)

    def test_complex_precedence(self):
        self.assertEqual(self.calc.evaluate("2 + 3 * 4"), 14)
        self.assertEqual(self.calc.evaluate("(2 + 3) * 4"), 20)
        self.assertEqual(self.calc.evaluate("100 // 5 + 2 ** 3"), 28)


if __name__ == '__main__':
    unittest.main()
