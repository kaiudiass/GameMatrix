---
name: Phosphor Grid Terminal
colors:
  surface: '#0f1412'
  surface-dim: '#0f1412'
  surface-bright: '#353a38'
  surface-container-lowest: '#0a0f0d'
  surface-container-low: '#181d1b'
  surface-container: '#1c211e'
  surface-container-high: '#262b29'
  surface-container-highest: '#313633'
  on-surface: '#dfe4e0'
  on-surface-variant: '#b9ccb5'
  inverse-surface: '#dfe4e0'
  inverse-on-surface: '#2c322f'
  outline: '#849581'
  outline-variant: '#3b4b3a'
  surface-tint: '#00e55b'
  primary: '#edffe8'
  on-primary: '#003911'
  primary-container: '#00ff66'
  on-primary-container: '#007128'
  inverse-primary: '#006e27'
  secondary: '#6ade7d'
  on-secondary: '#003912'
  secondary-container: '#2da54c'
  on-secondary-container: '#00320f'
  tertiary: '#efffe3'
  on-tertiary: '#053900'
  tertiary-container: '#3aff16'
  on-tertiary-container: '#107100'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#6bff83'
  primary-fixed-dim: '#00e55b'
  on-primary-fixed: '#002107'
  on-primary-fixed-variant: '#00531b'
  secondary-fixed: '#86fb96'
  secondary-fixed-dim: '#6ade7d'
  on-secondary-fixed: '#002108'
  on-secondary-fixed-variant: '#00531e'
  tertiary-fixed: '#79ff5b'
  tertiary-fixed-dim: '#2ae500'
  on-tertiary-fixed: '#022100'
  on-tertiary-fixed-variant: '#095300'
  background: '#0f1412'
  on-background: '#dfe4e0'
  surface-variant: '#313633'
typography:
  headline-xl:
    fontFamily: JetBrains Mono
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.04em
  headline-xl-mobile:
    fontFamily: JetBrains Mono
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: JetBrains Mono
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: JetBrains Mono
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.01em
  title-md:
    fontFamily: JetBrains Mono
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 22px
    letterSpacing: 0em
  body-lg:
    fontFamily: JetBrains Mono
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0em
  body-md:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-lg:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.08em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.12em
spacing:
  gutter: 0.75rem
  gutter-mobile: 0.5rem
  margin: 1.25rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style

The design system channels the uncompromising, utilitarian atmosphere of an illuminated CRT terminal and mainframe debugging console, engineered specifically for a mobile-first multiplayer Tic-Tac-Toe experience. The emotional tone evokes focused nostalgia, hacker precision, tension, and direct kinetic feedback. Every visual cue references monochromatic display tubes: electronic phosphorescence, scanlines, discrete telemetry, and strictly calculated spatial grids. 

Rather than adopting a kitschy or novelty retro aesthetic, the execution treats the interface with high-craft brutalist restraint. Elements are strictly rectilinear, stripped of skeuomorphic gloss, ambient blurs, or gratuitous gradients. Visual weight comes entirely from 1-pixel phosphor lines, box-drawing glyphs (`┌`, `─`, `┐`, `│`, `└`, `┘`), and sharp, monochrome contrast against a deep charcoal field.

## Colors

The palette revolves strictly around early-generation monochrome computer monitors:

- **Primary (`#00FF66`)**: Pure phosphor green. Reserved for active interactive targets, winning vectors, active player turn telemetry, and key game markers (`X` / `O`).
- **Secondary (`#008F39`)**: Mid-tier terminal green. Used for structural dividers, inactive borders, secondary labels, and muted status indicators.
- **Tertiary (`#39FF14`)**: Overdriven beam green. Employed sparingly for instant visual confirmation: strikeout lines, winning cell flash, connection pulse, and system-level alerts.
- **Neutral (`#0F1412`)**: Dark charcoal terminal backing. Prevents pure `#000000` clipping while sustaining high contrast and authentic display tube black levels.
- **Surface Accents (`#131B17`, `#1A2420`, `#062612`)**: Tiered container levels for modals, tactile board cells, and hovered keystroke simulations.

## Typography

The design system relies entirely on `JetBrains Mono` across all viewports to guarantee character alignment, monospaced tabular layouts, and an authentic terminal cadence. 

All UI microcopy and game communications are in Portuguese, written in concise, military-terminal prose:
- System commands and actions must always use uppercase (`JOGAR`, `CONECTAR`, `REINICIAR`, `DESCONECTAR`).
- Contextual status and telemetry readouts simulate boot sequences and command prompts (`SISTEMA: PRONTO`, `TURNO: JOGADOR_1`, `AGUARDANDO OPONENTE...`, `LATÊNCIA: 18MS`).
- Text elements never wrap awkwardly; line lengths are matched strictly to the monospace grid units.

## Layout & Spacing

Layout conforms to a focused vertical stack centered on the 3x3 play matrix:

- **Grid Architecture**: Single-column vertical flow on mobile displays with a maximum container boundary of `420px`. The 3x3 grid retains a strict 1:1 square aspect ratio anchored directly in the golden focal region of the viewport.
- **Rhythm & Alignments**: A uniform 4px base rhythm dictates all padding and offsets. Margins and gutters lock tightly to ensure UI elements align directly to character columns.
- **Adaptive Behavior**: On larger viewports or horizontal orientations, telemetry logs and player statistics dock to a secondary column alongside the board without enlarging the 3x3 board beyond its maximum fixed mobile dimensions (`360px × 360px`).

## Elevation & Depth

No soft drop shadows, ambient blur radiuses, or multi-step surface elevations exist in this system. Visual depth is established purely through electron beam luminescence and wireframe structure:

- **CRT Scanline Overlay**: A persistent background layer utilizing a 2px repeating linear gradient (`rgba(0, 0, 0, 0.35)` to transparent) across the viewport creates authentic monitor interlace lines without obstructing readability.
- **Luminescence Hierarchy**:
  - *Base Surface*: `#0F1412` flat backdrop.
  - *Container Surface*: Solid `#131B17` framed by a 1px border of `#008F39`.
  - *Focused / Active Elements*: Framed by a 1px border of `#00FF66`, accented with a tight, restrained glow: `box-shadow: 0 0 8px rgba(0, 255, 102, 0.4), inset 0 0 4px rgba(0, 255, 102, 0.2)`.
  - *Terminal Flash / Strikes*: `box-shadow: 0 0 16px rgba(57, 255, 20, 0.6)`.

## Shapes

The design system enforces absolute sharp geometry (`0px` corner radius). Rounded corners conflict with authentic CRT matrix displays and early monospaced terminal constraints.

All boundaries, inputs, modal dialogs, and the Tic-Tac-Toe grid cells are right-angled polygons. Edge details are achieved using ASCII-inspired box-drawing borders or solid, crisp 1px borders.

## Components

### 3x3 Matriz do Jogo (Tic-Tac-Toe Grid)
- **Estrutura**: Composta por 9 células quadradas delimitadas por bordas sólidas de `1px` em `#008F39`. A célula vazia possui fundo `#0F1412`. Ao toque/foco, a célula ativa brilha momentaneamente em `#00FF66`.
- **Símbolos (X e O)**:
  - `X`: Renderizado com traços vetoriais precisos de `3px` ou composto tipográfico em JetBrains Mono gigante, preenchido em `#00FF66` com leve glow fosforescente.
  - `O`: Círculo vetorial com anel de `3px` em `#39FF14`.
- **Vetor de Vitória**: Linha contínua neon de `2px` em `#39FF14` conectando os 3 pontos vencedores, acompanhada pelo piscar contínuo (efeito blink/strobe) das células vitoriosas.

### Botões de Comando
- **Padrão**: Fundo `#131B17`, borda de `1px` em `#008F39`, texto em caixa alta `label-lg` na cor `#00FF66`. Prefixo em prompt: `> JOGAR`, `> REVANCHE`.
- **Estado Ativo/Pressionado**: Fundo `#00FF66`, texto `#0F1412` com inversão monocromática instantânea.
- **Desabilitado**: Borda `#1F2E24`, texto `#1F2E24`, sem resposta tátil ou visual.

### Painel de Telemetria e Placar (Scoreboard & Status)
- Emoldurado por caracteres de terminal:
  ```text
  ┌─ PLACAR ──────────────┐
  │ [X] VOCÊ   : 03 VIT.  │
  │ [O] RIVAL  : 01 VIT.  │
  │ VELHA      : 02 EMP.  │
  └───────────────────────┘
  ```
- O turno ativo é destacado por um cursor pulsante em bloco (`█` ou `_`) ao lado do identificador do jogador.

### Chips de Status (Conexão / Modo)
- Estrutura compacta: `border: 1px solid #008F39; padding: 2px 6px;`.
- Exibição de ping e rede: `[● ON-LINE: 24MS]` ou `[○ AGUARDANDO OPONENTE]`. O indicador `●` pulsa a cada intervalo de 1 segundo.

### Campos de Entrada (Input / Código de Sala)
- Fundo `#0F1412`, borda inferior de `1px` em `#00FF66` com cursor vertical piscante. 
- Texto placeholder formatado como instrução de terminal: `DIGITE_CODIGO_SALA...`.

### Modais e Alertas de Sistema
- Sobreposição com opacidade `#0F1412` a 90% combinada com o efeito de scanlines.
- Caixa central delimitada por borda dupla de `1px` com cabeçalho de aviso em caixa alta: `[ ! ] CONEXÃO ENCERRADA PELO OPONENTE`. Botão de ação único: `[ CONFIRMAR ]`.