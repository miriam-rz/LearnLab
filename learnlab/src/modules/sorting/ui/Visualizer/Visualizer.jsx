import { useState, useEffect, useRef } from 'react'
import { StepType } from '../../model/algorithms.js'
import './Visualizer.css'

const SPEEDS = { slow: 600, medium: 200, fast: 60 }

export default function Visualizer({ algorithm, array, onComplete, completed }) {
  const [steps] = useState(() => algorithm.generateSteps(array))
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState('medium')
  const [hasFinished, setHasFinished] = useState(false)
  const timerRef = useRef(null)

  const step = steps[currentStep]
  const isLastStep = currentStep === steps.length - 1

  useEffect(() => {
    if (!isPlaying) return
    if (isLastStep) {
      setIsPlaying(false)
      setHasFinished(true)
      return
    }

    timerRef.current = setTimeout(() => {
      setCurrentStep(prev => prev + 1)
    }, SPEEDS[speed])

    return () => clearTimeout(timerRef.current)
  }, [isPlaying, currentStep, speed, isLastStep])

  useEffect(() => {
    setCurrentStep(0)
    setIsPlaying(false)
    setHasFinished(false)
    clearTimeout(timerRef.current)
  }, [algorithm, array])

  function handlePlayPause() {
    if (isLastStep) {
      setCurrentStep(0)
      setHasFinished(false)
      setIsPlaying(true)
    } else {
      setIsPlaying(p => !p)
    }
  }

  function handleReset() {
    clearTimeout(timerRef.current)
    setCurrentStep(0)
    setIsPlaying(false)
    setHasFinished(false)
  }

  function handleStepForward() {
    if (isLastStep) return
    setCurrentStep(prev => prev + 1)
    if (isLastStep) setHasFinished(true)
  }

  function handleStepBack() {
    if (currentStep === 0) return
    setCurrentStep(prev => prev - 1)
    setHasFinished(false)
  }

  return (
    <div className="visualizer">
      <div className="visualizer-header">
        <div>
          <span className="visualizer-algo-name" style={{ color: algorithm.color }}>
            {algorithm.name}
          </span>
          <span className="visualizer-complexity">{algorithm.complexity}</span>
        </div>
        <span className="visualizer-step-count">
          Paso {currentStep} / {steps.length - 1}
        </span>
      </div>

      <div className="visualizer-progress">
        <div
          className="visualizer-progress-fill"
          style={{
            width: `${(currentStep / (steps.length - 1)) * 100}%`,
            background: algorithm.color,
          }}
        />
      </div>

      <div className="visualizer-bars" role="img" aria-label={`Visualización de ${algorithm.name}`}>
        {step.array.map((value, i) => {
          const highlight = step.highlights[i]
          const isSorted = step.sortedIndices.has(i)
          return (
            <div key={i} className="visualizer-bar-wrapper">
              <div
                className="visualizer-bar"
                style={{
                  height: `${value}%`,
                  background: getBarColor(highlight, isSorted, algorithm.color),
                }}
              />
              <span className="visualizer-bar-value">{value}</span>
            </div>
          )
        })}
      </div>

      <div className="visualizer-description" role="status" aria-live="polite">
        <span className="visualizer-description-dot" style={{ background: algorithm.color }} />
        {step.description}
      </div>

      <div className="visualizer-legend">
        <span className="legend-item"><span className="legend-dot" style={{ background: '#fbbf24' }} />Comparando</span>
        <span className="legend-item"><span className="legend-dot" style={{ background: '#f87171' }} />Intercambiando</span>
        <span className="legend-item"><span className="legend-dot" style={{ background: '#4ade80' }} />Ordenado</span>
        <span className="legend-item"><span className="legend-dot" style={{ background: algorithm.color }} />Sin cambios</span>
      </div>

      <div className="visualizer-controls">
        <div className="controls-left">
          <button className="ctrl-btn" onClick={handleReset} aria-label="Reiniciar">↺</button>
          <button className="ctrl-btn" onClick={handleStepBack} disabled={currentStep === 0} aria-label="Paso atrás">⏮</button>
          <button className="ctrl-btn ctrl-btn-play" onClick={handlePlayPause} style={{ background: algorithm.color }} aria-label={isPlaying ? 'Pausar' : 'Reproducir'}>
            {isPlaying ? '⏸' : isLastStep ? '↺' : '▶'}
          </button>
          <button className="ctrl-btn" onClick={handleStepForward} disabled={isLastStep} aria-label="Paso adelante">⏭</button>
        </div>

        <div className="controls-speed">
          <span className="speed-label">Velocidad</span>
          {Object.keys(SPEEDS).map(s => (
            <button
              key={s}
              className={`speed-btn ${speed === s ? 'speed-btn-active' : ''}`}
              onClick={() => setSpeed(s)}
            >
              {s === 'slow' ? '🐢' : s === 'medium' ? '🐇' : '⚡'}
            </button>
          ))}
        </div>
      </div>

      {hasFinished && (
        <div className="visualizer-complete">
          <div className="complete-message">
            ¡Bien hecho! ¿Entendiste cómo funciona {algorithm.name}?
          </div>
          {!completed ? (
            <button
              className="complete-btn"
              style={{ background: algorithm.color }}
              onClick={onComplete}
            >
              Sí, desbloquear Nivel 2 
            </button>
          ) : (
            <div className="complete-done"> Nivel 1 completado</div>
          )}
        </div>
      )}
    </div>
  )
}

function getBarColor(highlight, isSorted, algoColor) {
  if (isSorted) return '#4ade80'
  if (highlight === StepType.SWAP) return '#f87171'
  if (highlight === StepType.COMPARE) return '#fbbf24'
  return algoColor
}
