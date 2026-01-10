# AI Literacy Platform - Design System

## Design Philosophy

**Terminal-Native Aesthetic** — The platform looks and feels like a modern CLI/terminal interface, inspired by Claude Code's visual language. This reinforces the AI-developer theme and creates a distinctive, memorable brand identity.

**Reference:** Ben Tossell's CLI-style portfolio (bentossell.com)

---

## Visual Identity

### Core Concept

```
┌─────────────────────────────────────────────────────────────────┐
│  ● ○ ○  │  ~/ai-literacy                                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  initializing session...                                        │
│  loading modules... done                                        │
│  connecting to platform... connected                            │
│                                                                 │
│   █████╗ ██╗    ██╗     ██╗████████╗                           │
│  ██╔══██╗██║    ██║     ██║╚══██╔══╝                           │
│  ███████║██║    ██║     ██║   ██║                              │
│  ██╔══██║██║    ██║     ██║   ██║                              │
│  ██║  ██║██║    ███████╗██║   ██║                              │
│  ╚═╝  ╚═╝╚═╝    ╚══════╝╚═╝   ╚═╝                              │
│                                                                 │
│  learn AI by doing. type help to see commands.                  │
│                                                                 │
│  > _                                                            │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  stage 1: prompting     │  shift+tab to cycle   │  Opus 4.5    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Color Palette

### Claude Code Theme (Dark)

```css
:root {
  /* Background layers */
  --bg-primary: #1A1A1A;        /* Main background */
  --bg-secondary: #252525;      /* Cards, elevated surfaces */
  --bg-tertiary: #2D2D2D;       /* Hover states, inputs */
  --bg-elevated: #333333;       /* Modals, dropdowns */

  /* Text colors */
  --text-primary: #E5E5E5;      /* Primary text */
  --text-secondary: #A3A3A3;    /* Secondary/muted text */
  --text-tertiary: #737373;     /* Disabled, hints */

  /* Accent - Anthropic Orange */
  --accent-primary: #D97706;    /* Primary accent (amber-600) */
  --accent-hover: #F59E0B;      /* Hover state (amber-500) */
  --accent-muted: #92400E;      /* Muted accent (amber-800) */

  /* Semantic colors */
  --success: #22C55E;           /* Green - passed, connected */
  --warning: #F59E0B;           /* Amber - hints, caution */
  --error: #EF4444;             /* Red - failed, errors */
  --info: #3B82F6;              /* Blue - info, links */

  /* Stage colors (retain original) */
  --stage-1: #3B82F6;           /* Blue - Prompting */
  --stage-2: #8B5CF6;           /* Purple - Structuring */
  --stage-3: #F59E0B;           /* Amber - Automation */
  --stage-4: #10B981;           /* Emerald - Vibe Coding */

  /* Borders */
  --border-default: #333333;
  --border-subtle: #292929;
  --border-accent: #D97706;
}
```

### Tailwind Config

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Terminal backgrounds
        terminal: {
          bg: '#1A1A1A',
          card: '#252525',
          input: '#2D2D2D',
          elevated: '#333333',
        },

        // Text
        term: {
          primary: '#E5E5E5',
          secondary: '#A3A3A3',
          muted: '#737373',
        },

        // Anthropic accent
        accent: {
          DEFAULT: '#D97706',
          hover: '#F59E0B',
          muted: '#92400E',
        },

        // Stages (original)
        stage: {
          1: '#3B82F6',
          2: '#8B5CF6',
          3: '#F59E0B',
          4: '#10B981',
        },

        // Semantic
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
      },

      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', 'monospace'],
      },

      fontSize: {
        'terminal': ['14px', '1.6'],
        'terminal-sm': ['12px', '1.5'],
        'terminal-lg': ['16px', '1.6'],
      },

      animation: {
        'cursor-blink': 'blink 1s step-end infinite',
        'typing': 'typing 2s steps(30) forwards',
        'fade-in': 'fadeIn 0.3s ease-out',
      },

      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        typing: {
          from: { width: '0' },
          to: { width: '100%' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
```

---

## Typography

### Font Stack

```css
/* Primary: Monospace for everything */
font-family: 'JetBrains Mono', 'Fira Code', 'SF Mono', Monaco, 'Cascadia Code', Consolas, monospace;

/* Fallback for system */
font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Monaco, Consolas, monospace;
```

### Font Installation

```bash
# Add to Next.js via next/font
import { JetBrains_Mono } from 'next/font/google';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});
```

### Type Scale

| Use Case | Size | Weight | Color |
|----------|------|--------|-------|
| Body text | 14px | 400 | term-primary |
| Secondary text | 14px | 400 | term-secondary |
| Labels | 12px | 500 | term-secondary |
| Headings | 16px | 600 | term-primary |
| ASCII art | 12px | 400 | accent |
| Code blocks | 13px | 400 | term-primary |
| Status bar | 12px | 400 | term-muted |

---

## Component Patterns

### Terminal Window Container

```tsx
// components/terminal/terminal-window.tsx
interface TerminalWindowProps {
  title?: string;
  children: React.ReactNode;
  showControls?: boolean;
}

export function TerminalWindow({ title, children, showControls = true }: TerminalWindowProps) {
  return (
    <div className="rounded-lg border border-terminal-elevated bg-terminal-bg overflow-hidden">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-terminal-card border-b border-terminal-elevated">
        {showControls && (
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
        )}
        {title && (
          <span className="text-terminal-sm text-term-secondary ml-2">
            {title}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 font-mono text-terminal">
        {children}
      </div>
    </div>
  );
}
```

### Command Prompt Input

```tsx
// components/terminal/command-input.tsx
interface CommandInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  prompt?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function CommandInput({
  value,
  onChange,
  onSubmit,
  prompt = '>',
  placeholder = 'type a command...',
  disabled = false,
}: CommandInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="flex items-center gap-2 bg-terminal-input rounded px-3 py-2 border border-terminal-elevated focus-within:border-accent">
      <span className="text-accent font-mono">{prompt}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 bg-transparent text-term-primary font-mono text-terminal
                   placeholder:text-term-muted outline-none"
      />
      <span className="w-2 h-5 bg-accent animate-cursor-blink" />
    </div>
  );
}
```

### Terminal Text Line

```tsx
// components/terminal/terminal-line.tsx
interface TerminalLineProps {
  prefix?: string;
  prefixColor?: 'accent' | 'success' | 'error' | 'info';
  children: React.ReactNode;
  animate?: boolean;
}

export function TerminalLine({
  prefix,
  prefixColor = 'accent',
  children,
  animate = false
}: TerminalLineProps) {
  const colorClasses = {
    accent: 'text-accent',
    success: 'text-success',
    error: 'text-error',
    info: 'text-info',
  };

  return (
    <div className={`font-mono text-terminal ${animate ? 'animate-fade-in' : ''}`}>
      {prefix && (
        <span className={`${colorClasses[prefixColor]} mr-2`}>{prefix}</span>
      )}
      <span className="text-term-primary">{children}</span>
    </div>
  );
}
```

### Status Bar

```tsx
// components/terminal/status-bar.tsx
interface StatusBarProps {
  left?: React.ReactNode;
  center?: React.ReactNode;
  right?: React.ReactNode;
}

export function StatusBar({ left, center, right }: StatusBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-8 bg-terminal-card border-t border-terminal-elevated
                    flex items-center justify-between px-4 font-mono text-terminal-sm text-term-muted">
      <div>{left}</div>
      <div>{center}</div>
      <div className="flex items-center gap-2">
        {right}
        <span className="text-accent">Claude</span>
      </div>
    </div>
  );
}
```

### Loading/Progress States

```tsx
// components/terminal/terminal-loader.tsx
export function TerminalLoader({ message = 'processing' }: { message?: string }) {
  return (
    <div className="font-mono text-terminal flex items-center gap-2">
      <span className="text-term-secondary">{message}</span>
      <span className="inline-flex gap-1">
        <span className="animate-pulse">.</span>
        <span className="animate-pulse delay-100">.</span>
        <span className="animate-pulse delay-200">.</span>
      </span>
    </div>
  );
}

// Boot sequence style
export function BootSequence({ steps }: { steps: string[] }) {
  return (
    <div className="space-y-1 font-mono text-terminal">
      {steps.map((step, i) => (
        <TerminalLine key={i} animate>
          {step}... <span className="text-success">done</span>
        </TerminalLine>
      ))}
    </div>
  );
}
```

---

## Page Layouts

### Login Page

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                                                                 │
│   initializing session...                                       │
│   loading authentication module... done                         │
│                                                                 │
│   ╔═══════════════════════════════════════╗                    │
│   ║  AI LITERACY PLATFORM                 ║                    │
│   ║  learn AI by doing                    ║                    │
│   ╚═══════════════════════════════════════╝                    │
│                                                                 │
│   > email: _                                                    │
│                                                                 │
│   > password: ••••••••                                         │
│                                                                 │
│   [  AUTHENTICATE  ]                                           │
│                                                                 │
│   new user? type 'register' to create account                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│  ● ○ ○  │  ~/ai-literacy/dashboard                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  user: john@example.com                                         │
│  level: 3  │  xp: 1,250  │  streak: 7 days                     │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  STAGE 1: PROMPTING                                            │
│  learn to get correct reasoning and output from AI              │
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │ clarity         │  │ constraints     │  │ context         │ │
│  │ ████████░░ 80%  │  │ ████░░░░░░ 40%  │  │ ░░░░░░░░░░ 0%   │ │
│  │ 3/5 complete    │  │ 2/5 complete    │  │ locked          │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│                                                                 │
│  > select scenario: _                                           │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  scenarios: 5 available  │  tab to navigate  │  Opus 4.5       │
└─────────────────────────────────────────────────────────────────┘
```

### Exercise Page

```
┌─────────────────────────────────────────────────────────────────┐
│  ● ○ ○  │  ~/scenarios/S1-CLARITY-001                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  SCENARIO: The Vague Summary Request                           │
│  skill: clarity  │  difficulty: ★☆☆☆☆  │  ~5 min               │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  CONTEXT:                                                       │
│  You're a marketing manager. Your CEO asked for a summary       │
│  of last quarter's campaign performance to share with board.    │
│                                                                 │
│  GOAL:                                                          │
│  Write a prompt that gets AI to produce a clear, usable         │
│  executive summary.                                             │
│                                                                 │
│  CONSTRAINTS:                                                   │
│  • Summary must be under 200 words                             │
│  • Include 3-5 bullet points of key metrics                    │
│  • Tone: professional but not dry                              │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  YOUR PROMPT:                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ > Write an executive summary for the board...           │   │
│  │   _                                                      │   │
│  │                                                          │   │
│  │                                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  [h] hint (2 left)  │  [enter] submit  │  [esc] back            │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  attempt: 1  │  chars: 47/5000  │  ctrl+enter to submit        │
└─────────────────────────────────────────────────────────────────┘
```

### Feedback Display

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  EVALUATION COMPLETE                                            │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                                                           │ │
│  │   SCORE: 78/100                            [  PASSED  ]   │ │
│  │   ████████████████████████████░░░░░░░░░░                  │ │
│  │                                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  BREAKDOWN:                                                     │
│  ├─ clarity      ████████████████████░░░░░  85%               │
│  ├─ constraints  ████████████████░░░░░░░░░  70%               │
│  ├─ context      ████████████████████░░░░░  80%               │
│  └─ format       ████████████████░░░░░░░░░  75%               │
│                                                                 │
│  + STRENGTHS:                                                   │
│    • Clear task specification                                   │
│    • Good use of context about audience                         │
│                                                                 │
│  - TO IMPROVE:                                                  │
│    • Specify exact word count limit                            │
│    • Request specific metric formatting                         │
│                                                                 │
│  > KEY ISSUE: Missing explicit length constraint               │
│                                                                 │
│  [r] retry  │  [n] next scenario  │  [d] dashboard              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## ASCII Art Assets

### Logo (Large)

```
   █████╗ ██╗    ██╗     ██╗████████╗███████╗██████╗  █████╗  ██████╗██╗   ██╗
  ██╔══██╗██║    ██║     ██║╚══██╔══╝██╔════╝██╔══██╗██╔══██╗██╔════╝╚██╗ ██╔╝
  ███████║██║    ██║     ██║   ██║   █████╗  ██████╔╝███████║██║      ╚████╔╝
  ██╔══██║██║    ██║     ██║   ██║   ██╔══╝  ██╔══██╗██╔══██║██║       ╚██╔╝
  ██║  ██║██║    ███████╗██║   ██║   ███████╗██║  ██║██║  ██║╚██████╗   ██║
  ╚═╝  ╚═╝╚═╝    ╚══════╝╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝   ╚═╝
```

### Logo (Compact)

```
  ╔═╗╦  ╦  ╦╔╦╗
  ╠═╣║  ║  ║ ║
  ╩ ╩╩═╝╩═╝╩ ╩
```

### Stage Icons

```
STAGE 1        STAGE 2        STAGE 3        STAGE 4
┌──────┐       ┌──────┐       ┌──────┐       ┌──────┐
│ ▶ AI │       │ { } │       │ ⚡️  │       │ 🚀  │
│PROMPT│       │STRUCT│       │ AUTO │       │ SHIP │
└──────┘       └──────┘       └──────┘       └──────┘
```

### Progress Bars

```
Complete:    ████████████████████ 100%
High:        ████████████████░░░░  80%
Medium:      ████████████░░░░░░░░  60%
Low:         ████████░░░░░░░░░░░░  40%
Empty:       ░░░░░░░░░░░░░░░░░░░░   0%
```

---

## Interaction Patterns

### Keyboard Shortcuts

| Action | Shortcut | Context |
|--------|----------|---------|
| Submit prompt | `Ctrl/Cmd + Enter` | Exercise page |
| Get hint | `H` | Exercise page |
| Retry | `R` | Feedback view |
| Next scenario | `N` | After passing |
| Back/Cancel | `Esc` | Anywhere |
| Navigate | `Tab` | Cards, inputs |
| Select | `Enter` | Focused element |

### Loading States

```
initializing...
loading modules... done
connecting to ai... connected
evaluating prompt...
```

### Error States

```
error: connection failed
  → check your internet connection
  → press 'r' to retry

error: evaluation timeout
  → the AI is taking longer than expected
  → your prompt has been saved
  → press 'r' to retry
```

### Success States

```
✓ prompt submitted
✓ evaluation complete
✓ scenario passed! +85 XP
✓ achievement unlocked: first_scenario
```

---

## Animation Guidelines

### Principles

1. **Terminal-authentic**: Animations should feel like terminal output
2. **Fast**: No animation should exceed 300ms
3. **Purposeful**: Only animate state changes, not decorations
4. **Subtle**: Prefer opacity and position over scale/rotation

### Standard Animations

```css
/* Text appearing (typing effect) */
.animate-type {
  animation: typing 0.5s steps(20) forwards;
  overflow: hidden;
  white-space: nowrap;
}

/* Line appearing */
.animate-line {
  animation: fadeIn 0.2s ease-out;
}

/* Cursor blink */
.animate-cursor {
  animation: blink 1s step-end infinite;
}

/* Progress bar fill */
.animate-progress {
  transition: width 0.5s ease-out;
}

/* Score counter */
.animate-score {
  transition: all 0.3s ease-out;
}
```

---

## Responsive Behavior

### Breakpoints

| Name | Width | Layout |
|------|-------|--------|
| Mobile | < 640px | Single column, full-width terminal |
| Tablet | 640-1024px | Two column where needed |
| Desktop | > 1024px | Full terminal experience |

### Mobile Adaptations

- Status bar becomes sticky header
- Command input at bottom (thumb-friendly)
- ASCII art scaled down or replaced with text
- Touch targets minimum 44px

---

## Accessibility

### Requirements

1. **Contrast**: All text meets WCAG AA (4.5:1 for normal, 3:1 for large)
2. **Focus indicators**: Visible focus ring on all interactive elements
3. **Screen readers**: Semantic HTML, ARIA labels where needed
4. **Keyboard**: Full keyboard navigation support
5. **Motion**: Respect `prefers-reduced-motion`

### Focus Styles

```css
/* Focus ring */
.focus-ring {
  outline: 2px solid var(--accent-primary);
  outline-offset: 2px;
}

/* For dark backgrounds */
*:focus-visible {
  outline: 2px solid #D97706;
  outline-offset: 2px;
}
```

---

## Implementation Notes

### CSS Global Styles

```css
/* globals.css additions */

/* Force dark mode */
html {
  color-scheme: dark;
}

body {
  @apply bg-terminal-bg text-term-primary font-mono;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  @apply bg-terminal-bg;
}

::-webkit-scrollbar-thumb {
  @apply bg-terminal-elevated rounded;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-term-muted;
}

/* Selection */
::selection {
  @apply bg-accent/30 text-term-primary;
}

/* Code blocks */
pre, code {
  @apply font-mono bg-terminal-input rounded px-1;
}
```

### Component Library Override

shadcn/ui components need these base overrides:

```css
/* Override shadcn defaults for terminal theme */
.card {
  @apply bg-terminal-card border-terminal-elevated;
}

.input, .textarea {
  @apply bg-terminal-input border-terminal-elevated text-term-primary
         placeholder:text-term-muted focus:border-accent;
}

.button {
  @apply font-mono;
}

.button-primary {
  @apply bg-accent hover:bg-accent-hover text-terminal-bg;
}

.button-outline {
  @apply border-terminal-elevated hover:bg-terminal-input hover:border-accent;
}
```

---

*Design System v1.0 — AI Literacy Platform*
