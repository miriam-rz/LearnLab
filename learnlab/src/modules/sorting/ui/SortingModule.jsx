import { useState, useCallback } from 'react'
import { ALGORITHMS, generateRandomArray } from '../model/algorithms.js'
import { LEVELS } from '../model/levels.js'
import LevelSelect from './LevelSelect/LevelSelect.jsx'
import Visualizer from './Visualizer/Visualizer.jsx'
import CodeEditor from './CodeEditor/CodeEditor.jsx'
import FreeEditor from './FreeEditor/FreeEditor.jsx'
import './SortingModule.css'

export default function SortingModule({ onBack }) {
  const [selectedAlgo, setSelectedAlgo]         = useState('bubble')
  const [activeLevel, setActiveLevel]           = useState(null)
  const [completedByAlgo, setCompletedByAlgo]   = useState({})
  const [array, setArray]                       = useState(() => generateRandomArray(16))

  const algo            = ALGORITHMS[selectedAlgo]
  const completedLevels = completedByAlgo[selectedAlgo] ?? new Set()

  const handleNewArray = useCallback(() => setArray(generateRandomArray(16)), [])

  function handleAlgoChange(algoId) {
    setSelectedAlgo(algoId)
    setActiveLevel(null)
  }

  function handleLevelComplete(levelId) {
    setCompletedByAlgo(prev => {
      const current = prev[selectedAlgo] ?? new Set()
      return { ...prev, [selectedAlgo]: new Set([...current, levelId]) }
    })
    const nextLevel = levelId + 1
    if (nextLevel <= LEVELS.length) setActiveLevel(nextLevel)
  }

  function handleBack() {
    activeLevel !== null ? setActiveLevel(null) : onBack()
  }

  return (
    <div className="sorting-module">
      <SortingHeader
        algo={algo}
        activeLevel={activeLevel}
        levels={LEVELS}
        selectedAlgo={selectedAlgo}
        onAlgoChange={handleAlgoChange}
        onBack={handleBack}
        onNewArray={handleNewArray}
      />
      <main className="sorting-content">
        <SortingView
          activeLevel={activeLevel}
          selectedAlgo={selectedAlgo}
          algo={algo}
          array={array}
          completedLevels={completedLevels}
          onLevelSelect={setActiveLevel}
          onLevelComplete={handleLevelComplete}
          onBackToLevels={() => setActiveLevel(null)}
        />
      </main>
    </div>
  )
}

function SortingHeader({ algo, activeLevel, levels, selectedAlgo, onAlgoChange, onBack, onNewArray }) {
  const backLabel    = activeLevel !== null ? 'Niveles' : 'Inicio'
  const currentLevel = levels.find(l => l.id === activeLevel)

  return (
    <header className="sorting-header">
      <div className="sorting-header-left">
        <button className="back-btn" onClick={onBack} aria-label="Regresar">
          ← {backLabel}
        </button>
        <Breadcrumb algo={algo} currentLevel={currentLevel} />
      </div>
      <AlgoTabs selectedAlgo={selectedAlgo} onSelect={onAlgoChange} />
      <button className="new-array-btn" onClick={onNewArray}>
        🔀 Nuevo arreglo
      </button>
    </header>
  )
}

function Breadcrumb({ algo, currentLevel }) {
  return (
    <div className="sorting-breadcrumb">
      <span className="breadcrumb-module" style={{ color: algo.color }}>
        ⚡ Ordenamiento
      </span>
      {currentLevel && (
        <>
          <span className="breadcrumb-sep">›</span>
          <span className="breadcrumb-level">{currentLevel.title}</span>
        </>
      )}
    </div>
  )
}

function AlgoTabs({ selectedAlgo, onSelect }) {
  return (
    <div className="algo-tabs">
      {Object.values(ALGORITHMS).map(a => (
        <button
          key={a.id}
          className={`algo-tab ${selectedAlgo === a.id ? 'algo-tab-active' : ''}`}
          style={{ '--algo-color': a.color }}
          onClick={() => onSelect(a.id)}
        >
          {a.name}
        </button>
      ))}
    </div>
  )
}

function SortingView({ activeLevel, selectedAlgo, algo, array, completedLevels, onLevelSelect, onLevelComplete, onBackToLevels }) {
  if (activeLevel === null) {
    return (
      <LevelSelect
        levels={LEVELS}
        completedLevels={completedLevels}
        onSelect={onLevelSelect}
        algorithmId={selectedAlgo}
        algorithms={ALGORITHMS}
      />
    )
  }

  if (activeLevel === 1) return (
    <LevelView tag="Nivel 1 — Observa" instruction={LEVELS[0].instruction}>
      <Visualizer
        algorithm={algo}
        array={array}
        onComplete={() => onLevelComplete(1)}
        completed={completedLevels.has(1)}
      />
    </LevelView>
  )

  if (activeLevel === 2) return (
    <LevelView tag="Nivel 2 — Completa" instruction={LEVELS[1].instruction}>
      <CodeEditor
        algorithmId={selectedAlgo}
        algorithm={algo}
        onComplete={() => onLevelComplete(2)}
        completed={completedLevels.has(2)}
      />
    </LevelView>
  )

  if (activeLevel === 3) return (
    <LevelView tag="Nivel 3 — Escribe" instruction={LEVELS[2].instruction}>
      <FreeEditor
        algorithmId={selectedAlgo}
        algorithm={algo}
        array={array}
        onComplete={() => onLevelComplete(3)}
        completed={completedLevels.has(3)}
      />
    </LevelView>
  )

  return <ComingSoon levelId={activeLevel} onBack={onBackToLevels} />
}

function LevelView({ tag, instruction, children }) {
  return (
    <div className="level-layout">
      <LevelInstruction tag={tag} text={instruction} />
      {children}
    </div>
  )
}

function LevelInstruction({ tag, text }) {
  return (
    <div className="level-instruction">
      <span className="level-instruction-tag">{tag}</span>
      <p>{text}</p>
    </div>
  )
}

function ComingSoon({ levelId, onBack }) {
  return (
    <div className="coming-soon">
      <span className="coming-soon-emoji">🚧</span>
      <h3>Nivel {levelId} en construcción</h3>
      <p>Este nivel estará disponible pronto.</p>
      <button className="back-btn" onClick={onBack}>← Volver a niveles</button>
    </div>
  )
}
