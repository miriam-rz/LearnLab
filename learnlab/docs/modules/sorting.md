# Sorting Module

The sorting module is the first educational module in LearnLab. It teaches sorting algorithms through a three-level progressive system.

---

## Location

```
src/modules/sorting/
```

---

## Folder Structure

```
sorting/
├── index.js                    # Module entry point
├── model/
│   ├── algorithms.js           # Pure sorting logic 
│   └── levels.js               # Level definitions and progression rules
├── ui/
│   ├── SortingModule.jsx       # Manages state and routing between views
│   ├── SortingModule.css
│   ├── LevelSelect/
│   │   ├── LevelSelect.jsx     # Level selection screen
│   │   └── LevelSelect.css
│   ├── Visualizer/
│   │   ├── Visualizer.jsx      # Algorithm animation (Level 1)
│   │   └── Visualizer.css
│   └── CodeEditor/
│       ├── CodeEditor.jsx      # Code editor (Levels 2 and 3)
│       └── CodeEditor.css
└── lib/
    └── codeParser.js           # Interprets user-written code via pattern matching
```

---

## Level System

Each algorithm has three levels of increasing difficulty:

```
LEVEL 1 — Observe        LEVEL 2 — Complete        LEVEL 3 — Write
─────────────────        ──────────────────         ───────────────
Watch the algorithm      Fill in the blanks         Free editor.
animation with           in a partially             Write everything
explanation.             written algorithm.         from scratch.
Learn what it does.      Guided practice.           Live visualization.
```

Levels are defined in `model/levels.js` as objects:

```js
{
  id: 1,
  type: "observe",     // "observe" | "complete" | "write"
  title: "Observa",
  color: "#...",
}
```

A level is unlocked once the previous one is completed. The `isLevelUnlocked()` function in `levels.js` handles this logic.

---

## Component Map

```
SortingModule.jsx  (state, routing)
    ├── SortingHeader
    │     ├── Breadcrumb
    │     └── AlgoTabs          ← switch between algorithms
    └── SortingView
          ├── LevelSelect       ← shown when no level is active
          ├── Visualizer        ← shown on Level 1 (type: "observe")
          └── CodeEditor        ← shown on Level 2 (type: "complete")
                                   and Level 3 (type: "write")
```

---

## Data Flow

```
SortingModule
    │
    ├── selectedAlgo  (string)        → which algorithm is active
    ├── activeLevel   (number | null) → which level is active, null = LevelSelect
    ├── completedLevels (Set)         → which levels the user has finished
    └── array         (number[])      → the array being visualized
```

---

## Algorithms Implemented

Defined in `model/algorithms.js`. Each algorithm is a pure function that receives an array and returns the sorted steps:

| Algorithm | ID |
|---|---|
| Bubble Sort | `bubble` |
| Selection Sort | `selection` |
| Insertion Sort | `insertion` |
| Merge Sort | `merge` |

---