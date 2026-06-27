# LearnLab — Architecture

LearnLab is an interactive educational visualizer for learning data structures and algorithms, created with React + Vite.

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 18 |
| Build Tool | Vite |
| Styling | CSS variables |
| Language | JavaScript (JSX) |
| Deployment | (pending) |

---

## Folder Structure

```
learnlab/
├── docs/                          # Project documentation
│   ├── architecture.md            # This file
│   └── modules/
│       ├── sorting.md             # in development
│       ├── pathfinding.md         # Pending
│       └── trees.md               # Pending
├── public/                        # Static assets
├── src/
│   ├── app/                       # Global configuration
│   │   ├── App.jsx                # Root component, module routing
│   │   ├── index.css              # Global CSS variables and reset
│   │   └── providers/
│   │       └── LanguageProvider.jsx  # Language context (ES/EN)
│   │
│   ├── shared/                    # Reusable code across the whole app
│   │   ├── ui/                    # Generic components
│   │   │   ├── Button/
│   │   │   └── Badge/
│   │   ├── i18n/                  # Translation strings
│   │   │   ├── es.js
│   │   │   └── en.js
│   │   └── hooks/                 # Reusable hooks
│   │       └── useLanguage.js
│   │
│   ├── modules/                   # One folder per educational module
│   │   └── sorting/
│   │       ├── index.js           # Module entry point
│   │       ├── model/             # Logic (no UI)
│   │       │   ├── algorithms.js  # Sorting algorithm implementations
│   │       │   └── levels.js      # Level definitions and progression
│   │       ├── ui/                # Visual components
│   │       │   ├── SortingModule.jsx
│   │       │   ├── CodeEditor/
│   │       │   │   ├── CodeEditor.jsx
│   │       │   │   └── CodeEditor.module.css
│   │       │   ├── Visualizer/
│   │       │   │   ├── Visualizer.jsx
│   │       │   │   └── Visualizer.module.css
│   │       │   └── LevelSelect/
│   │       └── lib/               # Module-specific utilities
│   │           └── codeParser.js  # Interprets user-written code
│   │
│   └── pages/                     # Full screens
│   │    └── Home/
│   │        ├── Home.jsx
│   │        └── Home.module.css
│   │
│   └─── main.jsx
│
├── index.html
├── package.json
└── vite.config.js
```

---

## Navigation Flow

```
main.jsx
   └── LanguageProvider (context)
          └── App.jsx  (module selection — Home screen)
                 ├── sorting/SortingModule.jsx     ← active
                 │      ├── LevelSelect
                 │      ├── Visualizer
                 │      └── CodeEditor
                 ├── PathfindingModule.jsx          ← pending
                 └── TreesModule.jsx                ← pending
```

The user starts at the Home screen. Selecting a module renders its container, which manages level progression and switches between its internal views.

---

## Architectural Principles

### 1. Feature-Sliced Design
The project follows a simplified version of Feature-Sliced Design:
- `app/` — global configuration and providers
- `shared/` — truly generic code with no business logic
- `modules/` — self-contained educational modules
- `pages/` — full screens that compose the above

### 2. Separation of concerns within each module
Each layer inside a module has a single responsibility:
- `model/` — pure logic only, no React, no UI
- `ui/` — visual components only, no algorithm logic
- `lib/` — module-specific utilities (e.g. parsing user code)

### 3. Isolated modules
Adding a new module (e.g. pathfinding) means creating a new folder under `src/modules/` without touching existing modules.

---

## Level System

LearnLab treats each algorithm as a three-level progression, like a programming video game.

```
LEVEL 1 — Observe        LEVEL 2 — Complete        LEVEL 3 — Write
─────────────────        ──────────────────         ───────────────
Watch the algorithm      Fill in the blanks         Free editor.
animation with           in a partially             Write everything
explanation.             written algorithm.         from scratch.
Learn what it does.      Guided practice.           Live visualization.
```

## Current Status

| Module | Status |
|---|---|
| Sorting | In development |
| Pathfinding | Pending |
| Trees | Pending |
| Stacks & Queues | Planned |
| Dictionaries & Maps | Planned |