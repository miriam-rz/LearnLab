import { useState, useCallback } from 'react'
import { buildSession, validateInput } from '../../model/codeTemplates.js'
//import { sanitizePaste } from '../../../../shared/lib/inputValidator.js'
import './CodeEditor.css'

export default function CodeEditor({ algorithmId, algorithm, onComplete, completed }) {
  const [session]     = useState(() => buildSession(algorithmId))
  const [retoIndex, setRetoIndex]   = useState(0)
  const [answers, setAnswers]       = useState({})
  const [checked, setChecked]       = useState({})
  const [retosDone, setRetosDone]   = useState(new Set())

  const currentReto   = session[retoIndex]
  const activeVariant = currentReto?.activeVariant
  const isLastReto    = retoIndex === session.length - 1

  const blanks = activeVariant?.lines
    .filter(line => line.blank !== null && line.blank !== undefined && line.code === null)
    .map(line => line.blank) ?? []

  const allBlanksAnswered = blanks.every(b => (answers[b.id] ?? '').trim().length > 0)
  const allBlanksCorrect  = blanks.every(b => checked[b.id] === true)

  const handleAnswerChange = useCallback((blankId, value) => {
    if (value.length > 60) return
    setAnswers(prev => ({ ...prev, [blankId]: value }))
    setChecked(prev => ({ ...prev, [blankId]: undefined }))
  }, [])

  const handlePaste = useCallback((e, blankId) => {
    e.preventDefault()
    const raw       = e.clipboardData.getData('text/plain')
    const sanitized = sanitizePaste(raw)
    handleAnswerChange(blankId, sanitized)
  }, [handleAnswerChange])

  function handleVerify() {
    const newChecked = {}
    blanks.forEach(blank => {
      newChecked[blank.id] = validateInput(answers[blank.id] ?? '', blank)
    })
    setChecked(newChecked)

    const allCorrect = blanks.every(b => newChecked[b.id] === true)
    if (allCorrect) setRetosDone(prev => new Set([...prev, currentReto.id]))
  }

  function handleNextReto() {
    if (isLastReto) {
      onComplete()
    } else {
      setRetoIndex(prev => prev + 1)
      setAnswers({})
      setChecked({})
    }
  }

  function handleRetry() {
    setAnswers({})
    setChecked({})
  }

  if (!currentReto || !activeVariant) return null

  return (
    <div className="code-editor">
      <RetoProgress
        session={session}
        retoIndex={retoIndex}
        retosDone={retosDone}
        color={algorithm.color}
      />
      <RetoHeader reto={currentReto} variant={activeVariant} color={algorithm.color} />
      <CodeDisplay
        lines={activeVariant.lines}
        answers={answers}
        checked={checked}
        onAnswerChange={handleAnswerChange}
        onPaste={handlePaste}
      />
      <EditorControls
        allAnswered={allBlanksAnswered}
        allCorrect={allBlanksCorrect}
        isLastReto={isLastReto}
        completed={completed}
        checked={checked}
        blanksCount={blanks.length}
        onVerify={handleVerify}
        onNext={handleNextReto}
        onRetry={handleRetry}
      />
    </div>
  )
}

function RetoProgress({ session, retoIndex, retosDone, color }) {
  return (
    <div className="reto-progress">
      {session.map((reto, i) => (
        <div
          key={reto.id}
          className={`reto-dot ${i === retoIndex ? 'reto-dot-active' : ''} ${retosDone.has(reto.id) ? 'reto-dot-done' : ''}`}
          style={i === retoIndex ? { borderColor: color } : {}}
          aria-label={`Reto ${i + 1}${retosDone.has(reto.id) ? ' completado' : ''}`}
        />
      ))}
      <span className="reto-progress-label">Reto {retoIndex + 1} de {session.length}</span>
    </div>
  )
}

function RetoHeader({ reto, variant, color }) {
  return (
    <div className="reto-header">
      <div className="reto-title" style={{ color }}>{reto.title}</div>
      <p className="reto-description">{reto.description}</p>
      <div className="reto-explanation">{variant.explanation}</div>
    </div>
  )
}

function CodeDisplay({ lines, answers, checked, onAnswerChange, onPaste }) {
  return (
    <div className="code-display" role="region" aria-label="Editor de código">
      <div className="code-lines">
        {lines.map((line, i) => (
          <CodeLine
            key={i}
            line={line}
            answers={answers}
            checked={checked}
            onAnswerChange={onAnswerChange}
            onPaste={onPaste}
          />
        ))}
      </div>
    </div>
  )
}

function CodeLine({ line, answers, checked, onAnswerChange, onPaste }) {
  if (line.code === null && line.blank === null) {
    return <div className="code-line code-line-empty" aria-hidden="true" />
  }

  if (line.blank === null) {
    return <div className="code-line"><span className="code-text">{line.code}</span></div>
  }

  const blank  = line.blank
  const value  = answers[blank.id] ?? ''
  const status = checked[blank.id]

  return (
    <div className="code-line code-line-blank">
      {blank.type === 'write'
        ? <WriteBlank blank={blank} value={value} status={status} onChange={val => onAnswerChange(blank.id, val)} onPaste={e => onPaste(e, blank.id)} />
        : <SelectBlank blank={blank} value={value} status={status} onChange={val => onAnswerChange(blank.id, val)} />
      }
    </div>
  )
}

function WriteBlank({ blank, value, status, onChange, onPaste }) {
  return (
    <div className="blank-wrapper">
      <input
        type="text"
        className={`blank-input blank-write ${buildStatusClass(status)}`}
        value={value}
        onChange={e => onChange(e.target.value)}
        onPaste={onPaste}
        maxLength={60}
        placeholder="escribe aquí..."
        aria-label={`Hueco: ${blank.hint}`}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
      />
      {status === false && <span className="blank-hint" role="alert">💡 {blank.hint}</span>}
    </div>
  )
}

function SelectBlank({ blank, value, status, onChange }) {
  return (
    <div className="blank-wrapper">
      <div className="blank-options" role="group" aria-label={blank.hint}>
        {blank.options.map(option => (
          <button
            key={option}
            className={`blank-option ${value === option ? 'blank-option-selected' : ''} ${value === option ? buildStatusClass(status) : ''}`}
            onClick={() => onChange(option)}
            aria-pressed={value === option}
          >
            <code>{option}</code>
          </button>
        ))}
      </div>
      {status === false && <span className="blank-hint" role="alert">💡 {blank.hint}</span>}
    </div>
  )
}

function EditorControls({ allAnswered, allCorrect, isLastReto, completed, checked, blanksCount, onVerify, onNext, onRetry }) {
  const hasBeenChecked = Object.keys(checked).length === blanksCount
  const hasErrors      = hasBeenChecked && !allCorrect

  return (
    <div className="editor-controls">
      {allCorrect && hasBeenChecked && (
        <SuccessBanner isLastReto={isLastReto} completed={completed} onNext={onNext} />
      )}
      {hasErrors && (
        <div className="editor-feedback-error" role="alert">
           Algunos huecos son incorrectos. Revisa las pistas y vuelve a intentarlo.
        </div>
      )}
      <div className="editor-buttons">
        {hasErrors && (
          <button className="btn-secondary" onClick={onRetry}>Reintentar</button>
        )}
        {!allCorrect && (
          <button className="btn-primary" onClick={onVerify} disabled={!allAnswered}>
            Verificar 
          </button>
        )}
      </div>
    </div>
  )
}

function SuccessBanner({ isLastReto, completed, onNext }) {
  return (
    <div className="editor-feedback-success" role="alert">
      <div className="success-message">
        ¡Correcto! {isLastReto ? '¡Completaste todos los retos!' : 'Avanza al siguiente reto.'}
      </div>
      {!completed && (
        <button className="complete-btn" onClick={onNext}>
          {isLastReto ? 'Desbloquear Nivel 3 ' : 'Siguiente reto '}
        </button>
      )}
      {completed && isLastReto && <div className="success-done"> Nivel 2 completado</div>}
    </div>
  )
}

function buildStatusClass(status) {
  if (status === true)  return 'blank-correct'
  if (status === false) return 'blank-incorrect'
  return ''
}
