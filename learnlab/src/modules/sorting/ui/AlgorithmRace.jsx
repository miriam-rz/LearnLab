import { useState, useEffect, useRef } from 'react'
import { ALGORITHMS, generateRandomArray } from '../model/algorithms.js'
import { StepType } from '../model/algorithms.js'
import './AlgorithmRace.css'

const SPEEDS = {
  slow:   500,
  medium: 150,
  fast:   30,
}

export default function AlgorithmRace({ array, builtAlgorithmId, allAlgorithms, onNewArray }) {
  const [raceData, setRaceData] = useState(() => buildRaceData(array, allAlgorithms))
  const [stepIndices, setStepIndices] = useState(() =>
    Object.keys(allAlgorithms).reduce((acc, id) => ({ ...acc, [id]: 0 }), {})
  )
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState('medium')
  const [winner, setWinner] = useState(null)
  const timerRef = useRef(null)

  useEffect(() => {
    setRaceData(buildRaceData(array, allAlgorithms))
    setStepIndices(Object.keys(allAlgorithms).reduce((acc, id) => ({ ...acc, [id]: 0 }), {}))
    setIsPlaying(false)
    setWinner(null)
    clearTimeout(timerRef.current)
  }, [array, allAlgorithms])

  useEffect(() => {
    if (!isPlaying) return
    const allDone = Object.keys(allAlgorithms).every(id => {
      const steps = raceData[id]
      return stepIndices[id] >= steps.length - 1
    })
    if (allDone) {
      setIsPlaying(false)
      return
    }
    timerRef.current = setTimeout(() => {
      setStepIndices(prev => {
        const next = { ...prev }
        let newWinner = winner
        Object.keys(allAlgorithms).forEach(id => {
          const steps = raceData[id]
          if (next[id] < steps.length - 1) {
            next[id] = next[id] + 1
            if (next[id] === steps.length - 1 && !newWinner) {
              newWinner = id
            }
          }
        })
        if (newWinner && newWinner !== winner) {
          setWinner(newWinner)
        }
        return next
      })
    }, SPEEDS[speed])
    return () => clearTimeout(timerRef.current)
  }, [isPlaying, stepIndices, speed, raceData, allAlgorithms, winner])

  function handlePlayPause() {
    setIsPlaying(p => !p)
  }

  function handleReset() {
    clearTimeout(timerRef.current)
    setStepIndices(Object.keys(allAlgorithms).reduce((acc, id) => ({ ...acc, [id]: 0 }), {}))
    setIsPlaying(false)
    setWinner(null)
  }

  function handleStepForward() {
    if (isPlaying) return
    setStepIndices(prev => {
      const next = { ...prev }
      Object.keys(allAlgorithms).forEach(id => {
        const steps = raceData[id]
        if (next[id] < steps.length - 1) next[id]++
      })
      return next
    })
  }

  const progress = Object.keys(allAlgorithms).reduce((acc, id) => {
    const steps = raceData[id]
    acc[id] = Math.round((stepIndices[id] / (steps.length - 1)) * 100)
    return acc
  }, {})

  return (
    <div className="race">
      {winner && (
        <div className="winnerBanner" role="alert">
          <span>🏆</span>
          <strong>{allAlgorithms[winner].name}</strong> terminó primero con{' '}
          {raceData[winner].length} pasos
          {winner === builtAlgorithmId && (
            <span className="yourAlgo"> — ¡tu algoritmo!</span>
          )}
        </div>
      )}
      <div className="visualizers">
        {Object.values(allAlgorithms).map(algo => {
          const steps = raceData[algo.id]
          const currentStep = steps[stepIndices[algo.id]]
          const isBuilt = algo.id === builtAlgorithmId
          return (
            <div
              key={algo.id}
              className={`algoViz ${isBuilt ? 'algoVizBuilt' : ''}`}
              style={{ '--algo-color': algo.color }}
            >
              <div className="vizHeader">
                <div>
                  <span className="vizName" style={{ color: algo.color }}>
                    {algo.name}
                    {isBuilt && <span className="builtTag"> ← tuyo</span>}
                  </span>
                  <span className="vizComplexity">{algo.complexity}</span>
                </div>
                <div className="vizStats">
                  <span>Paso {stepIndices[algo.id]}/{steps.length - 1}</span>
                </div>
              </div>
              <div className="progressBar" aria-hidden="true">
                <div
                  className="progressFill"
                  style={{
                    width: `${progress[algo.id]}%`,
                    background: algo.color,
                  }}
                />
              </div>
              <div
                className="bars"
                role="img"
                aria-label={`Estado de ${algo.name}: paso ${stepIndices[algo.id]}`}
              >
                {currentStep.array.map((value, i) => {
                  const highlight = currentStep.highlights[i]
                  const isSorted = currentStep.sortedIndices.has(i)
                  return (
                    <div key={i} className="barWrapper">
                      <div
                        className="bar"
                        style={{
                          height: `${value}%`,
                          background: getBarColor(highlight, isSorted, algo.color),
                        }}
                        aria-hidden="true"
                      />
                    </div>
                  )
                })}
              </div>
              <p className="stepDesc">{currentStep.description}</p>
            </div>
          )
        })}
      </div>
      <div className="controls">
        <div className="controlsLeft">
          <button
            className="btn-secondary"
            onClick={handleReset}
            disabled={isPlaying}
            aria-label="Reiniciar animación"
          >
            Reiniciar
          </button>
          <button
            className="btn-primary"
            onClick={handlePlayPause}
            aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
          >
            {isPlaying ? '⏸ Pausar' : '▶ Reproducir'}
          </button>
          <button
            className="btn-secondary"
            onClick={handleStepForward}
            disabled={isPlaying}
            aria-label="Avanzar un paso"
          >
            Paso
          </button>
        </div>
        <div className="speedControl" role="group" aria-label="Velocidad">
          <span className="speedLabel">Velocidad</span>
          {Object.keys(SPEEDS).map(s => (
            <button
              key={s}
              className={`speedBtn ${speed === s ? 'speedBtnActive' : ''}`}
              onClick={() => setSpeed(s)}
            >
              {s === 'slow' ? '🐢' : s === 'medium' ? '🐇' : '⚡'}
            </button>
          ))}
        </div>
        <button
          className="btn-secondary"
          onClick={onNewArray}
          aria-label="Generar nuevo arreglo"
        >
          Nuevo arreglo
        </button>
      </div>
      <div className="statsTable">
        <p className="sectionLabel">Comparativa de pasos totales</p>
        <div className="statsGrid">
          {Object.values(allAlgorithms).map(algo => (
            <div key={algo.id} className="statCard" style={{ '--algo-color': algo.color }}>
              <span className="statName" style={{ color: algo.color }}>{algo.name}</span>
              <span className="statSteps">{raceData[algo.id].length - 1}</span>
              <span className="statStepsLabel">pasos</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function buildRaceData(array, algorithms) {
  return Object.keys(algorithms).reduce((acc, id) => {
    acc[id] = algorithms[id].generateSteps(array)
    return acc
  }, {})
}

function getBarColor(highlight, isSorted, algoColor) {
  if (isSorted)                       return '#4ade80'
  if (highlight === StepType.SWAP)    return '#f87171'
  if (highlight === StepType.COMPARE) return '#fbbf24'
  return algoColor
}