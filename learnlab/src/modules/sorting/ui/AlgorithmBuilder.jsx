import { useState, useRef } from 'react'
import { ALGORITHMS } from '../model/algorithms.js'
import './AlgorithmBuilder.css'

const ALL_BLOCKS = {
  'outer-loop':  { id: 'outer-loop',  label: 'for i = 0 → n',          desc: 'Bucle exterior',           color: '#6366f1' },
  'inner-loop':  { id: 'inner-loop',  label: 'for j = 0 → n-i',        desc: 'Bucle interior adyacente', color: '#8b5cf6' },
  'compare':     { id: 'compare',     label: 'if arr[j] > arr[j+1]',    desc: 'Comparar adyacentes',      color: '#f59e0b' },
  'swap':        { id: 'swap',        label: 'swap(j, j+1)',            desc: 'Intercambiar',             color: '#ef4444' },
  'find-min':    { id: 'find-min',    label: 'minIdx = i',              desc: 'Guardar mínimo actual',    color: '#f59e0b' },
  'update-min':  { id: 'update-min',  label: 'if arr[j] < arr[minIdx]', desc: 'Actualizar mínimo',        color: '#f97316' },
  'store-key':   { id: 'store-key',   label: 'key = arr[i]',            desc: 'Guardar elemento actual',  color: '#f59e0b' },
  'shift-right': { id: 'shift-right', label: 'arr[j+1] = arr[j]',      desc: 'Desplazar a la derecha',   color: '#f97316' },
  'insert':      { id: 'insert',      label: 'arr[j+1] = key',          desc: 'Insertar en posición',     color: '#10b981' },
}

const BuildState = {
  IDLE:    'idle',
  BUILT:   'built',
  SUCCESS: 'success',
  ERROR:   'error',
}

export default function AlgorithmBuilder({ array, onAlgorithmBuilt, onNewArray }) {
  const [selectedAlgo, setSelectedAlgo] = useState('bubble')
  const [placedBlocks, setPlacedBlocks] = useState([])
  const [buildState, setBuildState] = useState(BuildState.IDLE)
  const draggedBlock = useRef(null)

  const algo = ALGORITHMS[selectedAlgo]
  const neededBlockIds = algo.correctBlocks
  const availableBlocks = neededBlockIds.map(id => ALL_BLOCKS[id])

  function handleAlgoChange(algoId) {
    setSelectedAlgo(algoId)
    setPlacedBlocks([])
    setBuildState(BuildState.IDLE)
  }

  function handleDragStart(e, blockId) {
    draggedBlock.current = blockId
    e.dataTransfer.effectAllowed = 'copy'
    e.dataTransfer.setData('text/plain', blockId)
  }

  function handleDragOver(e) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }

  function handleDrop(e) {
    e.preventDefault()
    const blockId = draggedBlock.current || e.dataTransfer.getData('text/plain')
    if (!blockId) return
    if (placedBlocks.length >= neededBlockIds.length) return
    if (placedBlocks.includes(blockId)) return
    setPlacedBlocks(prev => [...prev, blockId])
    setBuildState(BuildState.BUILT)
    draggedBlock.current = null
  }

  function handleRemoveBlock(index) {
    setPlacedBlocks(prev => prev.filter((_, i) => i !== index))
    setBuildState(placedBlocks.length > 1 ? BuildState.BUILT : BuildState.IDLE)
  }

  function handleKeyAddBlock(blockId) {
    if (placedBlocks.includes(blockId)) return
    if (placedBlocks.length >= neededBlockIds.length) return
    setPlacedBlocks(prev => [...prev, blockId])
    setBuildState(BuildState.BUILT)
  }

  function handleVerify() {
    const correct =
      placedBlocks.length === neededBlockIds.length &&
      neededBlockIds.every((id, i) => placedBlocks[i] === id)

    if (correct) {
      setBuildState(BuildState.SUCCESS)
      setTimeout(() => onAlgorithmBuilt(selectedAlgo), 1200)
    } else {
      setBuildState(BuildState.ERROR)
      setTimeout(() => setBuildState(BuildState.BUILT), 2000)
    }
  }

  function handleReset() {
    setPlacedBlocks([])
    setBuildState(BuildState.IDLE)
  }

  return (
    <div className="builder">
      <AlgoSelector
        algorithms={ALGORITHMS}
        selectedAlgo={selectedAlgo}
        onSelect={handleAlgoChange}
        description={algo.description}
      />

      <div className="workspace">
        <BlocksPanel
          blocks={availableBlocks}
          placedBlocks={placedBlocks}
          onDragStart={handleDragStart}
          onKeyAdd={handleKeyAddBlock}
        />
        <DropZone
          placedBlocks={placedBlocks}
          neededCount={neededBlockIds.length}
          buildState={buildState}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onRemove={handleRemoveBlock}
          onVerify={handleVerify}
          onReset={handleReset}
        />
      </div>

      <ArrayPreview array={array} onNewArray={onNewArray} />
    </div>
  )
}

function AlgoSelector({ algorithms, selectedAlgo, onSelect, description }) {
  return (
    <section className="algoSelect" aria-label="Seleccionar algoritmo">
      <p className="sectionLabel">Elige el algoritmo a construir</p>
      <div className="algoButtons">
        {Object.values(algorithms).map(a => (
          <button
            key={a.id}
            className={`algoBtn ${selectedAlgo === a.id ? 'algoBtnActive' : ''}`}
            style={{ '--algo-color': a.color }}
            onClick={() => onSelect(a.id)}
          >
            <span className="algoBtnName">{a.name}</span>
            <span className="algoBtnComplexity">{a.complexity}</span>
          </button>
        ))}
      </div>
      <p className="algoDesc">{description}</p>
    </section>
  )
}

function BlocksPanel({ blocks, placedBlocks, onDragStart, onKeyAdd }) {
  return (
    <aside className="blocksPanel" aria-label="Bloques disponibles">
      <p className="sectionLabel">Bloques disponibles</p>
      <p className="hint">Arrastra los bloques al área de construcción en el orden correcto</p>
      <div className="blocksList">
        {blocks.map(block => (
          <DraggableBlock
            key={block.id}
            block={block}
            used={placedBlocks.includes(block.id)}
            onDragStart={onDragStart}
            onKeyAdd={onKeyAdd}
          />
        ))}
      </div>
    </aside>
  )
}

function DraggableBlock({ block, used, onDragStart, onKeyAdd }) {
  return (
    <div
      className={`block ${used ? 'blockUsed' : ''}`}
      draggable={!used}
      onDragStart={e => onDragStart(e, block.id)}
      style={{ '--block-color': block.color }}
      role="button"
      tabIndex={used ? -1 : 0}
      aria-label={`Bloque: ${block.label}`}
      aria-disabled={used}
      onKeyDown={e => {
        if (e.key === 'Enter' && !used) onKeyAdd(block.id)
      }}
    >
      <code className="blockCode">{block.label}</code>
      <span className="blockDesc">{block.desc}</span>
    </div>
  )
}

function DropZone({ placedBlocks, neededCount, buildState, onDragOver, onDrop, onRemove, onVerify, onReset }) {
  const dropZoneClass = buildDropZoneClass(buildState)
  const canVerify = placedBlocks.length === neededCount && buildState !== BuildState.SUCCESS

  return (
    <section className="dropZoneWrapper" aria-label="Zona de construcción">
      <DropZoneHeader hasBlocks={placedBlocks.length > 0} onReset={onReset} />

      <div
        className={dropZoneClass}
        onDragOver={onDragOver}
        onDrop={onDrop}
        aria-label="Zona de soltar bloques"
        aria-dropeffect="copy"
      >
        {placedBlocks.length === 0
          ? <DropPlaceholder />
          : <PlacedBlocksList
              placedBlocks={placedBlocks}
              neededCount={neededCount}
              onRemove={onRemove}
            />
        }
      </div>

      <BuildFeedback buildState={buildState} />

      <button
        className="btn-primary"
        style={{ width: '100%', marginTop: 12, justifyContent: 'center' }}
        onClick={onVerify}
        disabled={!canVerify}
      >
        Verificar algoritmo
      </button>
    </section>
  )
}

function DropZoneHeader({ hasBlocks, onReset }) {
  return (
    <div className="dropZoneHeader">
      <p className="sectionLabel">Tu algoritmo</p>
      {hasBlocks && (
        <button className="resetBtn" onClick={onReset}>Limpiar</button>
      )}
    </div>
  )
}

function DropPlaceholder() {
  return (
    <div className="dropPlaceholder">
      <span className="dropIcon">📦</span>
      <p>Arrastra bloques aquí</p>
    </div>
  )
}

function PlacedBlocksList({ placedBlocks, neededCount, onRemove }) {
  const remaining = neededCount - placedBlocks.length

  return (
    <div className="placedBlocksList">
      {placedBlocks.map((blockId, index) => (
        <PlacedBlock
          key={`${blockId}-${index}`}
          blockId={blockId}
          index={index}
          onRemove={onRemove}
        />
      ))}
      {remaining > 0 && (
        <div className="remainingSlots">{remaining} bloque(s) más</div>
      )}
    </div>
  )
}

function PlacedBlock({ blockId, index, onRemove }) {
  const block = ALL_BLOCKS[blockId]

  return (
    <div className="placedBlock" style={{ '--block-color': block.color }}>
      <span className="placedBlockNum">{index + 1}</span>
      <code className="blockCode">{block.label}</code>
      <button
        className="removeBtn"
        onClick={() => onRemove(index)}
        aria-label={`Eliminar bloque ${block.label}`}
      >
        ×
      </button>
    </div>
  )
}

function BuildFeedback({ buildState }) {
  if (buildState === BuildState.SUCCESS) {
    return <div className="feedbackSuccess" role="alert">Correcto, lanzando carrera...</div>
  }
  if (buildState === BuildState.ERROR) {
    return <div className="feedbackError" role="alert">Orden incorrecto, intenta nuevamente.</div>
  }
  return null
}

function ArrayPreview({ array, onNewArray }) {
  return (
    <section className="arrayPreview" aria-label="Arreglo a ordenar">
      <div className="arrayPreviewHeader">
        <p className="sectionLabel">Arreglo a ordenar</p>
        <button className="resetBtn" onClick={onNewArray}>Nuevo arreglo</button>
      </div>
      <div className="bars" role="img" aria-label={`Arreglo con ${array.length} elementos`}>
        {array.map((value, i) => (
          <ArrayBar key={i} value={value} />
        ))}
      </div>
    </section>
  )
}

function ArrayBar({ value }) {
  return (
    <div className="barWrapper">
      <div
        className="bar"
        style={{
          height: `${value}%`,
          background: `hsl(${260 - (value / 100) * 60}deg, 80%, 65%)`,
        }}
        aria-hidden="true"
      />
      <span className="barValue">{value}</span>
    </div>
  )
}

function buildDropZoneClass(buildState) {
  const base = 'dropZone'
  if (buildState === BuildState.SUCCESS) return `${base} dropZoneSuccess`
  if (buildState === BuildState.ERROR)   return `${base} dropZoneError`
  return base
}
