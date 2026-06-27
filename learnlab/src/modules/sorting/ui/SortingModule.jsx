import { useState, useCallback } from 'react'
import AlgorithmBuilder from './AlgorithmBuilder.jsx'
import AlgorithmRace from './AlgorithmRace.jsx'
import { generateRandomArray, ALGORITHMS } from '../model/algorithms.js'
import './SortingModule.css'

const VIEWS = {
  BUILD: 'build',
  RACE: 'race',
}

export default function SortingModule({ onBack }) {
  const [view, setView] = useState(VIEWS.BUILD)
  const [array, setArray] = useState(() => generateRandomArray(14))
  const [builtAlgorithm, setBuiltAlgorithm] = useState(null)

  const handleNewArray = useCallback(() => {
    setArray(generateRandomArray(14))
    setBuiltAlgorithm(null)
    setView(VIEWS.BUILD)
  }, [])

  const handleAlgorithmBuilt = useCallback((algorithmId) => {
    setBuiltAlgorithm(algorithmId)
    setView(VIEWS.RACE)
  }, [])

  return (
    <div className="module">
      <header className="header">
        <div className="headerLeft">
          <button className="backBtn" onClick={onBack} aria-label="Volver al inicio">
            Inicio
          </button>
          <div className="breadcrumb">
            <span className="breadcrumbModule">⚡ Ordenamiento</span>
            <span className="breadcrumbSep">›</span>
            <span className="breadcrumbView">
              {view === VIEWS.BUILD ? 'Construye el algoritmo' : 'Carrera de algoritmos'}
            </span>
          </div>
        </div>
        <nav className="tabs" aria-label="Vistas del módulo">
          <button
            className={`tab ${view === VIEWS.BUILD ? 'tabActive' : ''}`}
            onClick={() => setView(VIEWS.BUILD)}
          >
            Construir
          </button>
          <button
            className={`tab ${view === VIEWS.RACE ? 'tabActive' : ''}`}
            onClick={() => setView(VIEWS.RACE)}
            disabled={!builtAlgorithm}
            aria-disabled={!builtAlgorithm}
            title={!builtAlgorithm ? 'Primero construye el algoritmo' : undefined}
          >
            Carrera
          </button>
        </nav>
      </header>
      <main className="content">
        {view === VIEWS.BUILD ? (
          <AlgorithmBuilder
            array={array}
            onAlgorithmBuilt={handleAlgorithmBuilt}
            onNewArray={handleNewArray}
          />
        ) : (
          <AlgorithmRace
            array={array}
            builtAlgorithmId={builtAlgorithm}
            allAlgorithms={ALGORITHMS}
            onNewArray={handleNewArray}
          />
        )}
      </main>
    </div>
  )
}