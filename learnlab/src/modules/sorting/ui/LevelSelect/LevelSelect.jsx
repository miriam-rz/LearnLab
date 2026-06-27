import { isLevelUnlocked } from "../../model/levels";
import  "./LevelSelect.css";

export default function LevelSelect({ levels, completedLevels, onSelect, algorithmId, algorithms }) {
    const algo = algorithms[algorithmId]
    return (
    <div className="level-select">
      <LevelSelectHeader algo={algo} />
      <LevelGrid
        levels={levels}
        completedLevels={completedLevels}
        onSelect={onSelect}
      />
    </div>
  )
}

function LevelSelectHeader({ algo }) {
  return (
    <div className="level-select-header">
      <div className="level-select-algo" style={{ color: algo.color }}>
        {algo.name}
      </div>
      <h2 className="level-select-title">¿En qué nivel quieres practicar?</h2>
      <p className="level-select-sub">
        Completa cada nivel para desbloquear el siguiente.
      </p>
    </div>
  )
}

function LevelGrid({ levels, completedLevels, onSelect }) {
  return (
    <div className="level-cards">
      {levels.map((level) => (
        <LevelCard
          key={level.id}
          level={level}
          unlocked={isLevelUnlocked(level, completedLevels)}
          completed={completedLevels.has(level.id)}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}

function LevelCard({ level, unlocked, completed, onSelect }) {
  const cardClass = buildCardClass(unlocked, completed)
  const ctaText = buildCtaText(unlocked, completed)
  const ctaClass = buildCtaClass(unlocked, completed)

  return (
    <button
      className={cardClass}
      style={{ '--level-color': level.color }}
      onClick={() => unlocked && onSelect(level.id)}
      disabled={!unlocked}
      aria-label={unlocked ? `Nivel ${level.id}: ${level.title}` : `Nivel ${level.id} bloqueado`}
    >
      <LevelCardStatus unlocked={unlocked} completed={completed} />
      <div className="level-card-emoji">{level.emoji}</div>
      <div className="level-card-num">Nivel {level.id}</div>
      <div className="level-card-title">{level.title}</div>
      <p className="level-card-desc">{level.description}</p>
      <div className={ctaClass}>{ctaText}</div>
    </button>
  )
}

function LevelCardStatus({ unlocked, completed }) {
  if (completed) return <div className="level-card-status"><span className="level-status-done">✓</span></div>
  if (unlocked)  return <div className="level-card-status"><span className="level-status-open">●</span></div>
  return         <div className="level-card-status"><span className="level-status-locked">🔒</span></div>
}

function buildCardClass(unlocked, completed) {
  const base = 'level-card'
  const state = unlocked ? 'level-card-unlocked' : 'level-card-locked'
  const done  = completed ? 'level-card-completed' : ''
  return [base, state, done].filter(Boolean).join(' ')
}

function buildCtaText(unlocked, completed) {
  if (completed) return 'Completado ✓'
  if (unlocked)  return 'Comenzar →'
  return 'Completa el nivel anterior'
}

function buildCtaClass(unlocked, completed) {
  if (completed) return 'level-card-cta level-card-cta-done'
  if (!unlocked) return 'level-card-cta level-card-cta-locked'
  return 'level-card-cta'
}