import { useState, useCallback, useRef, useEffect } from 'react'
import { parseCode, getHighlightsForStage, Stage } from '../../lib/codeParser.js'
import { sanitizePaste } from '../../../../shared/lib/inputValidator.js'
import './FreeEditor.css'

import SortingWorker from '../../lib/sortingWorker.js?worker'

const REFERENCE = {
  bubble: `for (let i = 0; i < n - 1; i++) {
  for (let j = 0; j < n - i - 1; j++) {
    if (arr[j] > arr[j + 1]) {
      const temp = arr[j]
      arr[j] = arr[j + 1]
      arr[j + 1] = temp
    }
  }
}`,
  selection: `for (let i = 0; i < n - 1; i++) {
  let minIdx = i
  for (let j = i + 1; j < n; j++) {
    if (arr[j] < arr[minIdx]) minIdx = j
  }
  if (minIdx !== i) {
    const temp = arr[i]
    arr[i] = arr[minIdx]
    arr[minIdx] = temp
  }
}`,
  insertion: `for (let i = 1; i < n; i++) {
  const key = arr[i]
  let j = i - 1
  while (j >= 0 && arr[j] > key) {
    arr[j + 1] = arr[j]
    j--
  }
  arr[j + 1] = key
}`,
  merge: `function mergeSort(arr) {
  if (arr.length <= 1) return arr
  const mid = Math.floor(arr.length / 2)
  const left = mergeSort(arr.slice(0, mid))
  const right = mergeSort(arr.slice(mid))
  return merge(left, right)
}`,
}

const ValidationState = {
  IDLE:     'idle',
  RUNNING:  'running',
  SUCCESS:  'success',
  ERROR:    'error',
}

export default function FreeEditor({ algorithmId, algorithm, array, onComplete, completed }) {
  const [code, setCode]                   = useState('')
  const [parseResult, setParseResult]     = useState({ stage: Stage.EMPTY, progress: 0, message: '' })
  const [validation, setValidation]       = useState({ state: ValidationState.IDLE, message: '', analysis: null })
  const [showReference, setShowReference] = useState(false)

  const parseTimer  = useRef(null)
  const workerRef   = useRef(null)

  useEffect(() => {
    workerRef.current = new SortingWorker()

    workerRef.current.onmessage = (event) => {
      const { success, sorted, error, analysis, message } = event.data

      if (!success || !sorted) {
        setValidation({
          state: ValidationState.ERROR,
          message: error || message || 'El arreglo no quedó ordenado correctamente.',
          analysis: null,
        })
        return
      }

      setValidation({
        state: ValidationState.SUCCESS,
        message: analysis.message,
        analysis,
      })
    }

    workerRef.current.onerror = () => {
      setValidation({
        state: ValidationState.ERROR,
        message: 'Error al ejecutar el código. Revisa la sintaxis.',
        analysis: null,
      })
    }

    return () => {
      workerRef.current?.terminate()
    }
  }, [])

  const handleCodeChange = useCallback((value) => {
    if (value.length > 2000) return
    setCode(value)
    setValidation({ state: ValidationState.IDLE, message: '', analysis: null })

    clearTimeout(parseTimer.current)
    parseTimer.current = setTimeout(() => {
      const result = parseCode(value, algorithmId)
      setParseResult(result)
    }, 300)
  }, [algorithmId])

  const handlePaste = useCallback((e) => {
    e.preventDefault()
    const raw       = e.clipboardData.getData('text/plain')
    const sanitized = sanitizePaste(raw, 2000)
    handleCodeChange(sanitized)
  }, [handleCodeChange])

  function handleRun() {
    if (!code.trim() || !workerRef.current) return
    setValidation({ state: ValidationState.RUNNING, message: 'Ejecutando tu código...', analysis: null })
    workerRef.current.postMessage({ code, array })
  }

  function handleReset() {
    setCode('')
    setParseResult({ stage: Stage.EMPTY, progress: 0, message: '' })
    setValidation({ state: ValidationState.IDLE, message: '', analysis: null })
  }

  const highlights      = getHighlightsForStage(parseResult.stage, array)
  const isSuccess       = validation.state === ValidationState.SUCCESS

  return (
    <div className="free-editor">
      <div className="free-editor-layout">
        <EditorPanel
          code={code}
          algorithmId={algorithmId}
          algorithm={algorithm}
          parseResult={parseResult}
          validation={validation}
          showReference={showReference}
          onCodeChange={handleCodeChange}
          onPaste={handlePaste}
          onReset={handleReset}
          onRun={handleRun}
          onToggleReference={() => setShowReference(p => !p)}
        />
        <VisualizerPanel
          array={array}
          highlights={highlights}
          parseResult={parseResult}
          algorithm={algorithm}
          validation={validation}
          isSuccess={isSuccess}
          completed={completed}
          onComplete={onComplete}
        />
      </div>
    </div>
  )
}

function EditorPanel({ code, algorithmId, algorithm, parseResult, validation, showReference, onCodeChange, onPaste, onReset, onRun, onToggleReference }) {
  const isRunning = validation.state === ValidationState.RUNNING

  return (
    <div className="editor-panel">
      <EditorToolbar
        algorithm={algorithm}
        hasCode={code.length > 0}
        showReference={showReference}
        onReset={onReset}
        onToggleReference={onToggleReference}
      />

      <textarea
        className="free-editor-textarea"
        value={code}
        onChange={e => onCodeChange(e.target.value)}
        onPaste={onPaste}
        placeholder={getPlaceholder(algorithmId)}
        maxLength={2000}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        aria-label={`Editor de código para ${algorithm.name}`}
      />

      <ParseStatus parseResult={parseResult} />

      <div className="editor-run-bar">
        <span className="editor-chars">{code.length}/2000</span>
        <button
          className="btn-primary"
          onClick={onRun}
          disabled={!code.trim() || isRunning}
          aria-label="Ejecutar y validar código"
        >
          {isRunning ? '⏳ Ejecutando...' : '▶ Ejecutar y validar'}
        </button>
      </div>

      <ValidationFeedback validation={validation} />

      {showReference && <ReferencePanel algorithmId={algorithmId} />}
    </div>
  )
}

function EditorToolbar({ algorithm, hasCode, showReference, onReset, onToggleReference }) {
  return (
    <div className="editor-toolbar">
      <span className="editor-toolbar-title" style={{ color: algorithm.color }}>
        {algorithm.name} — Escribe tu solución
      </span>
      <div className="editor-toolbar-actions">
        <button
          className={`toolbar-btn ${showReference ? 'toolbar-btn-active' : ''}`}
          onClick={onToggleReference}
          aria-pressed={showReference}
        >
          💡 {showReference ? 'Ocultar pista' : 'Ver pista'}
        </button>
        {hasCode && (
          <button className="toolbar-btn" onClick={onReset}>Limpiar</button>
        )}
      </div>
    </div>
  )
}

function ParseStatus({ parseResult }) {
  const { stage, progress, message } = parseResult
  if (stage === Stage.EMPTY) return null

  const color = getStageColor(stage)

  return (
    <div className="editor-status">
      <div className="editor-status-bar">
        <div className="editor-status-fill" style={{ width: `${progress * 100}%`, background: color }} />
      </div>
      {message && <p className="editor-status-message" style={{ color }}>{message}</p>}
    </div>
  )
}

function ValidationFeedback({ validation }) {
  const { state, message, analysis } = validation

  if (state === ValidationState.IDLE) return null

  if (state === ValidationState.RUNNING) {
    return <div className="validation-running">⏳ {message}</div>
  }

  if (state === ValidationState.ERROR) {
    return <div className="validation-error" role="alert">{message}</div>
  }

  if (state === ValidationState.SUCCESS) {
    return (
      <div className="validation-success" role="alert">
        <div className="validation-success-title">¡Algoritmo correcto!</div>
        <div className="validation-complexity">
          Complejidad detectada: <code>{analysis.complexity}</code>
        </div>
        <p className="validation-tip">{message}</p>
      </div>
    )
  }

  return null
}

function ReferencePanel({ algorithmId }) {
  return (
    <div className="reference-panel" aria-label="Código de referencia">
      <p className="reference-title">Referencia — intenta no copiar directo</p>
      <pre className="reference-code">{REFERENCE[algorithmId]}</pre>
    </div>
  )
}

function VisualizerPanel({ array, highlights, parseResult, algorithm, validation, isSuccess, completed, onComplete }) {
  return (
    <div className="visualizer-panel">
      <p className="visualizer-panel-label">Visualización en tiempo real</p>
      <LiveBars array={array} highlights={highlights} algorithm={algorithm} />
      <StageLegend stage={parseResult.stage} />
      {isSuccess && (
        <CompleteBanner completed={completed} onComplete={onComplete} />
      )}
    </div>
  )
}

function LiveBars({ array, highlights, algorithm }) {
  return (
    <div className="live-bars" role="img" aria-label="Visualización del algoritmo">
      {array.map((value, i) => (
        <LiveBar
          key={i}
          value={value}
          highlight={highlights[i]}
          algoColor={algorithm.color}
        />
      ))}
    </div>
  )
}

function LiveBar({ value, highlight, algoColor }) {
  return (
    <div className="live-bar-wrapper">
      <div
        className={`live-bar ${highlight ? `live-bar-${highlight}` : ''}`}
        style={{
          height: `${value}%`,
          background: getBarBackground(highlight, algoColor),
        }}
        aria-hidden="true"
      />
    </div>
  )
}

function StageLegend({ stage }) {
  const labels = {
    [Stage.EMPTY]:      { text: 'Esperando código...', color: '#555566' },
    [Stage.OUTER_LOOP]: { text: 'Bucle exterior detectado', color: '#a78bfa' },
    [Stage.INNER_LOOP]: { text: 'Bucle interior detectado', color: '#818cf8' },
    [Stage.COMPARE]:    { text: 'Comparación detectada', color: '#fbbf24' },
    [Stage.SWAP]:       { text: 'Intercambio detectado', color: '#f87171' },
    [Stage.COMPLETE]:   { text: '¡Patrón completo reconocido!', color: '#4ade80' },
    [Stage.UNKNOWN]:    { text: 'Sigue escribiendo...', color: '#555566' },
  }

  const label = labels[stage] ?? labels[Stage.UNKNOWN]

  return (
    <div className="stage-legend" style={{ color: label.color }}>
      <span className="stage-dot" style={{ background: label.color }} />
      {label.text}
    </div>
  )
}

function CompleteBanner({ completed, onComplete }) {
  return (
    <div className="complete-banner" role="alert">
      <p className="complete-banner-text">¡Tu algoritmo ordena correctamente!</p>
      {!completed
        ? <button className="complete-btn" onClick={onComplete}>Completar Nivel 3 </button>
        : <p className="complete-done"> Nivel 3 completado</p>
      }
    </div>
  )
}

function getPlaceholder(algorithmId) {
  const hints = {
    bubble:    'Escribe tu solución aquí...\n\nPuedes usar cualquier enfoque válido.\nEjemplo: for (let i = 0; ...',
    selection: 'Escribe tu solución aquí...\n\nNo tiene que ser exactamente Selection Sort.\nCualquier algoritmo que ordene es válido.',
    insertion: 'Escribe tu solución aquí...\n\nEmpieza con: for (let i = 1; ...',
    merge:     'Escribe tu solución aquí...\n\nPuedes usar recursión o iteración.',
  }
  return hints[algorithmId] ?? 'Escribe el algoritmo aquí...'
}

function getStageColor(stage) {
  const colors = {
    [Stage.OUTER_LOOP]: '#a78bfa',
    [Stage.INNER_LOOP]: '#818cf8',
    [Stage.COMPARE]:    '#fbbf24',
    [Stage.SWAP]:       '#f87171',
    [Stage.COMPLETE]:   '#4ade80',
    [Stage.UNKNOWN]:    '#555566',
  }
  return colors[stage] ?? '#555566'
}

function getBarBackground(highlight, algoColor) {
  const colors = {
    outer:   algoColor,
    compare: '#fbbf24',
    swap:    '#f87171',
    sorted:  '#4ade80',
  }
  return colors[highlight] ?? '#1a1a2e'
}
