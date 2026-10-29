# 🐍 PyCalc Studio — Calculadora Moderna em Python com Terminal e Efeitos Sonoros

Uma calculadora moderna, responsiva e de alta precisão que combina uma interface visual elegante em **Glassmorphism**, animações fluidas, efeitos sonoros sintetizados via **Web Audio API**, histórico lateral persistente e um **Terminal Python interativo em tempo real** impulsionado por código Python nativo (`calculator.py`) e **WebAssembly (Pyodide)** no navegador.

---

## ✨ Funcionalidades Principais

- 🧮 **Operações Matemáticas Completas**:
  - Operações básicas: Adição (`+`), Subtração (`-`), Multiplicação (`*`), Divisão (`/`).
  - Operadores nativos de Python: Divisão inteira (`//`), Potência (`**`), Módulo / Resto (`%`), Raiz quadrada (`math.sqrt`) e Parênteses (`(`, `)`).
  - Tratamento inteligente de erros matemáticos (como divisão por zero e sintaxe inválida).
- 🔊 **Efeitos Sonoros Sintetizados**:
  - Áudio de latência zero gerado em tempo real via **Web Audio API** (sem dependência de arquivos externos).
  - Tons senoidais distintos para números, pulsos para operadores e acordes harmônicos suaves ao pressionar o botão de igual (`=`).
  - Controle de volume com controle deslizante e botão de mudo com um clique.
- 💻 **Terminal Python em Tempo Real**:
  - Exibe a linha de código Python correspondente a cada operação em tempo real (`>>> resultado = 120 * 4`).
  - Saída do console com medição de tempo de execução em milissegundos (`[exec: 0.45ms]`).
  - Campo de entrada interativo (REPL) para digitar qualquer expressão ou código Python diretamente e executá-lo no motor.
- 📜 **Histórico Lateral Persistente**:
  - Registro de cálculos anteriores com data, hora e tempo de processamento.
  - Um clique para copiar o resultado ou reinserir o valor na calculadora.
  - Opção para exportar os cálculos em arquivo `.txt` ou limpar todo o histórico.
- 🌓 **Modo Escuro e Modo Claro**:
  - Alternância de tema com transições suaves e persistência da preferência no navegador (`localStorage`).
- ⌨️ **Suporte a Teclado Físico**:
  - Controle total através do teclado numérico e atalhos convencionais (`0-9`, `+`, `-`, `*`, `/`, `Enter`, `Backspace`, `Esc`).
- 📁 **Código Python Nativo Incluído**:
  - Módulo nativo `calculator.py` com CLI interativo e avaliação segura via árvore sintática abstrata (`ast`).
  - Suíte de 10 testes unitários automatizados em `test_calculator.py`.

---

## 📂 Estrutura de Arquivos

```text
├── calculator.py              # Lógica central da calculadora em Python nativo (CLI & Classe)
├── test_calculator.py         # Testes unitários automatizados em Python (unittest)
├── index.html                 # Ponto de entrada HTML com fontes e metatags
├── package.json               # Dependências do frontend e scripts
├── tsconfig.json              # Configurações do compilador TypeScript
├── vite.config.ts             # Configurações do Vite e Tailwind CSS
└── src/
    ├── main.tsx               # Inicialização da aplicação React
    ├── App.tsx                # Componente mestre e gerenciador de estados da calculadora
    ├── types.ts               # Tipagens TypeScript (cálculos, terminal, sons e temas)
    ├── index.css              # Estilos globais e tipografia (Plus Jakarta Sans & JetBrains Mono)
    ├── services/
    │   ├── pythonEngine.ts    # Motor de execução Python (Pyodide WebAssembly + fallback local)
    │   └── soundService.ts    # Síntese sonora digital com Web Audio API
    └── components/
        ├── Navbar.tsx         # Barra de navegação com controles de áudio, tema e links
        ├── CalculatorDisplay.tsx # Visor de alta definição com escala dinâmica de texto
        ├── CalculatorKeypad.tsx  # Teclado com animações táteis e feedback sonoro
        ├── HistorySidebar.tsx    # Painel lateral de histórico com exportação e cópia
        ├── TerminalOutput.tsx    # Terminal interativo Python com streaming de logs
        └── PythonCodeModal.tsx   # Visualizador do código Python nativo na interface
```

---

## 🚀 Como Executar Localmente

### 1. Interface Web (Calculadora com Terminal)

Certifique-se de ter o **Node.js** (versão 18 ou superior) instalado:

```bash
# 1. Instalar as dependências do projeto
npm install

# 2. Iniciar o servidor de desenvolvimento
npm run dev
```

Acesse a URL indicada no terminal (geralmente `http://localhost:3000`).

---

### 2. Motor Python via Linha de Comando (CLI)

Você também pode utilizar o arquivo `calculator.py` diretamente pelo terminal Python:

```bash
# Executar uma expressão diretamente
python3 calculator.py "2 ** 10 + 50 * 2"

# Iniciar o modo interativo REPL no terminal
python3 calculator.py

# Executar a suíte de testes unitários
python3 -m unittest test_calculator.py
```

## 🛠️ Tecnologias Utilizadas

- **Linguagem**: Python 3.12 (`calculator.py`, `ast`, `math`)
- **Frontend**: React 19 + TypeScript + Vite
- **Estilização**: Tailwind CSS v4 + Framer Motion
- **Áudio**: Web Audio API nativa (sem arquivos pesados)
- **WebAssembly**: Pyodide CPython in-browser
- **Ícones**: Lucide React

---
