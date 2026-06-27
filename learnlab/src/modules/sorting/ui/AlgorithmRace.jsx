import { useState, useEffect, useRef } from 'react'
import { ALGORITHMS } from '../model/algorithms.js'
import { StepType } from '../model/algorithms.js'
import './AlgorithmRace.css'

const SPEEDS = { slow: 500, medium: 150, fast: 30 }

export default function AlgorithmRace({ array, builtAlgorithmId, allAlgorithms, onNewArray }) {
  const [raceData, setRaceData]       = useState(() => buildRaceData(array, allAlgorithms))
  const [stepIndices, setStepIndices] = useState(() => buildInitialIndices(allAlgorithms))
  const [isPlaying, setIsPlaying]     = useState(false)
  const [speed, setSpeed]             = useState('medium')
  const [winner, setWinner]           = useState(null)
  const timerRef = useRef(null)

  useEffect(() => {
    setRaceData(buildRaceData(array, allAlgorithms))
    setStepIndices(buildInitialIndices(allAlgorithms))
    setIsPlaying(false)
    setWinner(null)
    clearTimeout(timerRef.current)
  }, [array, allAlgorithms])

  useEffect(() => {
    if (!isPlaying) return

    const allDone = Object.keys(allAlgorithms).every(
      id => stepIndices[id] >= raceData[id].length - 1
    )
    if (allDone) { setIsPlaying(false); return }

    timerRef.current = setTimeout(() => {
      setStepIndices(prev => advanceStep(prev, raceData, allAlgorithms, winner, setWinner))
    }, SPEEDS[speed])

    return () => clearTimeout(timerRef.current)
  }, [isPlaying, stepIndices, speed, raceData, allAlgorithms, winner])

  function handlePlayPause() { setIsPlaying(p => !p) }

  function handleReset() {
    clearTimeout(timerRef.current)
    setStepIndices(buildInitialIndices(allAlgorithms))
    setIsPlaying(false)
    setWinner(null)
  }

  function handleStepForward() {
    if (isPlaying) return
    setStepIndices(prev => advanceStep(prev, raceData, allAlgorithms, winner, setWinner))
  }

  const progress = buildProgress(stepIndices, raceData, allAlgorithms)

  return (
    <div className="race">
      {winner && (
        <WinnerBanner
          winner={winner}
          allAlgorithms={allAlgorithms}
          raceData={raceData}
          builtAlgorithmId={builtAlgorithmId}
        />
      )}

      <AlgoVisualizerGrid
        allAlgorithms={allAlgorithms}
        raceData={raceData}
        stepIndices={stepIndices}
        progress={progress}
        builtAlgorithmId={builtAlgorithmId}
      />

      <RaceControls
        isPlaying={isPlaying}
        speed={speed}
        onPlayPause={handlePlayPause}
        onReset={handleReset}
        onStepForward={handleStepForward}
        onSpeedChange={setSpeed}
        onNewArray={onNewArray}
      />

      <StatsTable allAlgorithms={allAlgorithms} raceData={raceData} />
    </div>
  )
}

function WinnerBanner({ winner, allAlgorithms, raceData, builtAlgorithmId }) {
  const isUserAlgo = winner === builtAlgorithmId

  return (
    <div className="winnerBanner" role="alert">
      <span>🏆</span>
      <strong>{allAlgorithms[winner].name}</strong>
      {' '}terminó primero con {raceData[winner].length} pasos
      {isUserAlgo && <span className="yourAlgo"> — tu algoritmo</span>}
    </div>
  )
}

function AlgoVisualizerGrid({ allAlgorithms, raceData, stepIndices, progress, builtAlgorithmId }) {
  return (
    <div className="visualizers">
      {Object.values(allAlgorithms).map(algo => (
        <AlgoVisualizer
          key={algo.id}
          algo={algo}
          steps={raceData[algo.id]}
          currentStep={raceData[algo.id][stepIndices[algo.id]]}
          stepIndex={stepIndices[algo.id]}
          progress={progress[algo.id]}
          isBuilt={algo.id === builtAlgorithmId}
        />
      ))}
    </div>
  )
}

function AlgoVisualizer({ algo, steps, currentStep, stepIndex, progress, isBuilt }) {
  return (
    <div
      className={`algoViz ${isBuilt ? 'algoVizBuilt' : ''}`}
      style={{ '--algo-color': algo.color }}
    >
      <AlgoVizHeader algo={algo} stepIndex={stepIndex} totalSteps={steps.length} isBuilt={isBuilt} />
      <ProgressBar progress={progress} color={algo.color} />
      <BarsDisplay currentStep={currentStep} algoColor={algo.color} algoName={algo.name} stepIndex={stepIndex} />
      <p className="stepDesc">{currentStep.description}</p>
    </div>
  )
}

function AlgoVizHeader({ algo, stepIndex, totalSteps, isBuilt }) {
  return (
    <div className="vizHeader">
      <div>
        <span className="vizName" style={{ color: algo.color }}>
          {algo.name}
          {isBuilt && <span className="builtTag"> ← tuyo</span>}
        </span>
        <span className="vizComplexity">{algo.complexity}</span>
      </div>
      <div className="vizStats">
        Paso {stepIndex}/{totalSteps - 1}
      </div>
    </div>
  )
}

function ProgressBar({ progress, color }) {
  return (
    <div className="progressBar" aria-hidden="true">
      <div className="progressFill" style={{ width: `${progress}%`, background: color }} />
    </div>
  )
}

function BarsDisplay({ currentStep, algoColor, algoName, stepIndex }) {
  return (
    <div className="bars" role="img" aria-label={`Estado de ${algoName}: paso ${stepIndex}`}>
      {currentStep.array.map((value, i) => (
        <RaceBar
          key={i}
          value={value}
          highlight={currentStep.highlights[i]}
          isSorted={currentStep.sortedIndices.has(i)}
          algoColor={algoColor}
        />
      ))}
    </div>
  )
}

function RaceBar({ value, highlight, isSorted, algoColor }) {
  return (
    <div className="barWrapper">
      <div
        className="bar"
        style={{
          height: `${value}%`,
          background: getBarColor(highlight, isSorted, algoColor),
        }}
        aria-hidden="true"
      />
    </div>
  )
}

function RaceControls({ isPlaying, speed, onPlayPause, onReset, onStepForward, onSpeedChange, onNewArray }) {
  return (
    <div className="controls">
      <div className="controlsLeft">
        <button className="btn-secondary" onClick={onReset} disabled={isPlaying}>↺ Reiniciar</button>
        <button className="btn-primary" onClick={onPlayPause}>{isPlaying ? '⏸ Pausar' : '▶ Reproducir'}</button>
        <button className="btn-secondary" onClick={onStepForward} disabled={isPlaying}>⏭ Paso</button>
      </div>
      <SpeedSelector speed={speed} onSpeedChange={onSpeedChange} />
      <button className="btn-secondary" onClick={onNewArray}>Nuevo arreglo</button>
    </div>
  )
}

function SpeedSelector({ speed, onSpeedChange }) {
  const labels = { slow: '🐢', medium: '🐇', fast: '⚡' }

  return (
    <div className="speedControl" role="group" aria-label="Velocidad">
      <span className="speedLabel">Velocidad</span>
      {Object.keys(SPEEDS).map(s => (
        <button
          key={s}
          className={`speedBtn ${speed === s ? 'speedBtnActive' : ''}`}
          onClick={() => onSpeedChange(s)}
        >
          {labels[s]}
        </button>
      ))}
    </div>
  )
}

function StatsTable({ allAlgorithms, raceData }) {
  return (
    <div className="statsTable">
      <p className="sectionLabel">Comparación de pasos en total</p>
      <div className="statsGrid">
        {Object.values(allAlgorithms).map(algo => (
          <StatCard key={algo.id} algo={algo} totalSteps={raceData[algo.id].length - 1} />
        ))}
      </div>
    </div>
  )
}

function StatCard({ algo, totalSteps }) {
  return (
    <div className="statCard" style={{ '--algo-color': algo.color }}>
      <span className="statName" style={{ color: algo.color }}>{algo.name}</span>
      <span className="statSteps">{totalSteps}</span>
      <span className="statStepsLabel">pasos</span>
    </div>
  )
}

function buildRaceData(array, algorithms) {
  return Object.keys(algorithms).reduce((acc, id) => {
    acc[id] = algorithms[id].generateSteps(array)
    return acc
  }, {})
}

function buildInitialIndices(algorithms) {
  return Object.keys(algorithms).reduce((acc, id) => ({ ...acc, [id]: 0 }), {})
}

function buildProgress(stepIndices, raceData, algorithms) {
  return Object.keys(algorithms).reduce((acc, id) => {
    acc[id] = Math.round((stepIndices[id] / (raceData[id].length - 1)) * 100)
    return acc
  }, {})
}

function advanceStep(prev, raceData, allAlgorithms, winner, setWinner) {
  const next = { ...prev }
  let newWinner = winner

  Object.keys(allAlgorithms).forEach(id => {
    const steps = raceData[id]
    if (next[id] < steps.length - 1) {
      next[id]++
      if (next[id] === steps.length - 1 && !newWinner) {
        newWinner = id
      }
    }
  })

  if (newWinner && newWinner !== winner) setWinner(newWinner)
  return next
}

function getBarColor(highlight, isSorted, algoColor) {
  if (isSorted)                       return '#4ade80'
  if (highlight === StepType.SWAP)    return '#f87171'
  if (highlight === StepType.COMPARE) return '#fbbf24'
  return algoColor
}
