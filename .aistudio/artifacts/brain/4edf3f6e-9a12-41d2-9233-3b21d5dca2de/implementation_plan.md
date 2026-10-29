# Calculadora Python Moderna & Terminal Interativo

Uma aplicação de calculadora refinada impulsionada por um motor Python real com terminal interativo em tempo real, design moderno com efeito vidro fosco (glassmorphism), animações fluidas via Framer Motion, efeitos sonoros sintetizados digitais com Web Audio API, alternância entre modo claro e escuro e painel lateral de histórico persistente.

---

> [!IMPORTANT]
> **Decisões Confirmadas pelo Usuário**:
> 1. **Motor de Execução Python**: Execução em tempo real no cliente com terminal interativo e espelhamento de comandos Python nativos (com biblioteca matemática e REPL).
> 2. **Direção Visual**: Design moderno e sofisticado com vidro fosco (glassmorphism), profundidade sutil, bordas finas elegantes e iluminação suave em modo escuro e claro.
> 3. **Design Sonoro**: Efeitos sonoros sintetizados digitais e suaves (tons senoidais e harmônicos gerados via Web Audio API, sem arquivos externos frágeis) com botão rápido de mudo.

---

### 1. Visão Geral e Conceito Central

- **O que faz**: Oferece uma calculadora de precisão inspirada no ecossistema Python, unindo usabilidade imediata (teclado numérico na tela e teclado físico) a uma saída de terminal Python ao vivo que reflete o código Python real executado a cada cálculo.
- **Público-Alvo**: Estudantes, programadores, entusiastas de tecnologia e usuários que buscam uma calculadora esteticamente impecável com transparência de execução em código.
- **Diferencial de Valor**: Além das quatro operações básicas e funções avançadas (`+`, `-`, `*`, `/`, `//`, `%`, `**`, `sqrt`), o usuário pode ver a sintaxe Python pura sendo gerada, acompanhar a execução no console em tempo real e acessar o histórico de operações com um clique.

---

### 2. Experiência do Usuário e Design Visual

- **Fluxo do Usuário**:
  1. O usuário visualiza o layout balanceado: à esquerda a Calculadora Principal com visor de alta resolução; à direita o Histórico de Cálculos e na base/painel adjacente o Terminal Python em Tempo Real.
  2. Ao pressionar números ou operadores (pela tela ou teclado do computador), ouve-se um feedback sonoro sintetizado suave e animação de clique com amortecimento elástico (spring motion).
  3. No display superior aparece a expressão em construção, e no display principal o valor atual formatado.
  4. Simultaneamente, o terminal Python emite a linha de comando correspondente (ex: `>>> result = 12.5 * 8` e a saída formatada `100.0`).
  5. Ao pressionar `=`, um acorde harmônico suave toca, o resultado final é exibido e salvo automaticamente no histórico lateral com data, hora e expressão.
  6. O usuário pode alternar instantaneamente entre o **Modo Escuro** (ardósia profunda, efeito vidro escuro e detalhes sutis de luz) e o **Modo Claro** (branco translúcido, sombras suaves de estúdio e tipografia contrastante).

- **Identidade Visual e Tema**:
  - *Estética*: Glassmorphism refinado, bordas finas com micro-reflexo de luz, cantos arredondados balanceados (`rounded-2xl` e `rounded-xl`).
  - *Cores Modo Escuro*: Fundo `#0B0F19`, painéis `#111827/80` com `backdrop-blur-xl`, acentos em índigo/azul violeta `#6366F1` e esmeralda para saídas bem-sucedidas no terminal.
  - *Cores Modo Claro*: Fundo `#F8FAFC`, painéis `#FFFFFF/85` com `backdrop-blur-xl`, sombras suaves multicamadas e contraste nítido em ardósia escura `#0F172A`.
  - *Tipografia*: Tipografia moderna display (`Plus Jakarta Sans` ou `Outfit`) com números no display e histórico em números tabulares (`font-mono tabular-nums`) e terminal em `JetBrains Mono / monospace`.
  - *Zero-Pill Discipline*: Metadados no histórico e terminal limpos, sem cápsulas plásticas genéricas ou badges estáticos desnecessários.

- **Design Sonoro (Web Audio API Nativo)**:
  - *Dígitos (0-9)*: Pips senoidais curtos e macios (frequências de 440Hz a 880Hz com envelope exponencial de 35ms).
  - *Operadores (+, -, *, /)*: Tonalidade de transição média com leve harmônico de confirmação.
  - *Resultado (=)*: Acorde harmônico diatônico suave (dois osciladores combinados com decaimento musical).
  - *Limpar / Backspace*: Tom sutil descendente de descarte.
  - *Controles*: Botão de mudo com feedback visual claro (ícone de som ativo/mudo) e controle de volume integrado.

---

### 3. Decisões do Produto e Trade-offs

- **Motor Python no Cliente**:
  - *Abordagem*: Motor híbrido robusto que executa avaliação de sintaxe Python autêntica no navegador com terminal REPL real em tempo real, suporte a operadores Python nativos (`//`, `**`, `%`, `math.sqrt`, etc.) e captura de `stdout/stderr`.
  - *Por que*: Resposta instantânea (<5ms) sem latência de rede, confiabilidade absoluta mesmo sem conexão à internet e fidelidade matemática.
- **Web Audio API vs. Arquivos de Áudio Estáticos**:
  - *Abordagem*: Síntese algorítmica direta de ondas sonoras no navegador (`AudioContext`, `OscillatorNode`, `GainNode`).
  - *Por que*: Zero problemas com carregamento de MP3/WAV externo, sem falhas de CORS ou links quebrados, e latência ultra-baixa de áudio (imediata ao toque/clique).
- **Persistência do Histórico**:
  - *Abordagem*: Armazenamento em `localStorage` para que os cálculos do usuário permaneçam salvos entre recarregamentos, com opção de cópia com um clique e limpeza individual ou total.

---

### 4. Arquitetura Técnica e Estratégia de Dados

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Barra Superior de Ações                         │
│  [Logo / Nome] ─────────────────────── [Sons On/Off] [Tema Claro/Escuro]
├───────────────────────────────────┬────────────────────────────────────┤
│                                   │                                    │
│   Visor da Calculadora (Display)  │     Painel de Histórico Lateral    │
│   - Expressão atual               │     - Expressões recentes          │
│   - Valor em tempo real           │     - Resultados calculados        │
│                                   │     - Clicar para reutilizar       │
│   Grade de Teclas Interativas     │     - Botão Limpar Histórico       │
│   - Funções (C, CE, +/-, %)       │                                    │
│   - Operadores (/ * - + = // **)  │                                    │
│   - Teclado numérico 0-9 e ponto  │                                    │
│                                   │                                    │
├───────────────────────────────────┴────────────────────────────────────┤
│                                                                        │
│   Terminal Python em Tempo Real (Live Python Output)                   │
│   >>> Expressão Python executada com destaque de sintaxe               │
│   >>> Retorno do console e stdout                                      │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

- **Mapeamento de Estado e Componentes**:
  - `useCalculator`: Gerencia o buffer de entrada, operadores ativos, memória, histórico e gatilhos de cálculo.
  - `useSoundFX`: Instância singleton de áudio sintetizado com controle de volume, mudo e predefinição de tons.
  - `useTheme`: Alternador de tema dark/light sincronizado com a classe raiz e persistência no navegador.
  - `TerminalView`: Terminal estilizado com logs cronológicos em tempo real, linhas de entrada `>>>` e valores processados.
  - `HistorySidebar`: Lista de cálculos anteriores com animações de inserção, botão de reutilizar valor e exportação.

---

### 5. Plano de Verificação

1. **Testes de Funcionalidade**:
   - Adição, subtração, multiplicação, divisão comum e operadores Python (`//`, `**`, `%`).
   - Tratamento de divisão por zero (mensagem amigável no visor e erro detalhado no terminal).
   - Suporte completo ao teclado físico (0-9, +, -, *, /, Enter, Backspace, Esc).
2. **Design e Responsividade**:
   - Teste nos modos Claro e Escuro garantindo contraste WCAG AA e legibilidade.
   - Layout fluido tanto em telas desktop amplas quanto em telas intermediárias e mobile.
3. **Áudio e Animações**:
   - Verificação da resposta sonora e micro-interações sem lag perceptível.
   - Teste do botão de silenciamento.
