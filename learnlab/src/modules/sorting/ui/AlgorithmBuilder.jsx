import { useState, useRef } from 'react'
import { ALGORITHMS } from '../model/algorithms.js'
import './AlgorithmBuilder.css'

const ALL_BLOCKS = {
  'outer-loop':  { id: 'outer-loop',  label: 'for i = 0 → n',           desc: 'Bucle exterior',           color: '#6366f1' },
  'inner-loop':  { id: 'inner-loop',  label: 'for j = 0 → n-i',         desc: 'Bucle interior adyacente', color: '#8b5cf6' },
  'compare':     { id: 'compare',     label: 'if arr[j] > arr[j+1]',     desc: 'Comparar adyacentes',      color: '#f59e0b' },
  'swap':        { id: 'swap',        label: 'swap(j, j+1)',             desc: 'Intercambiar',             color: '#ef4444' },
  'find-min':    { id: 'find-min',    label: 'minIdx = i',               desc: 'Guardar mínimo actual',    color: '#f59e0b' },
  'update-min':  { id: 'update-min',  label: 'if arr[j] < arr[minIdx]',  desc: 'Actualizar mínimo',        color: '#f97316' },
  'store-key':   { id: 'store-key',   label: 'key = arr[i]',             desc: 'Guardar elemento actual',  color: '#f59e0b' },
  'shift-right': { id: 'shift-right', label: 'arr[j+1] = arr[j]',       desc: 'Desplazar a la derecha',   color: '#f97316' },
  'insert':      { id: 'insert',      label: 'arr[j+1] = key',           desc: 'Insertar en posición',     color: '#10b981' },
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

  function handleVerify() {
    const correct = neededBlockIds.every((id, i) => placedBlocks[i] === id)
      && placedBlocks.length === neededBlockIds.length

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
      <section className="algoSelect" aria-label="Seleccionar algoritmo">
        <p className="sectionLabel">Elige el algoritmo a construir</p>
        <div className="algoButtons">
          {Object.values(ALGORITHMS).map(a => (
            <button
              key={a.id}
              className={`algoBtn ${selectedAlgo === a.id ? 'algoBtnActive' : ''}`}
              style={{ '--algo-color': a.color }}
              onClick={() => {
                setSelectedAlgo(a.id)
                setPlacedBlocks([])
                setBuildState(BuildState.IDLE)
              }}
            >
              <span className="algoBtnName">{a.name}</span>
              <span className="algoBtnComplexity">{a.complexity}</span>
            </button>
          ))}
        </div>
        <p className="algoDesc">{algo.description}</p>
      </section>

      <div className="workspace">
        <aside className="blocksPanel" aria-label="Bloques disponibles">
          <p className="sectionLabel">Bloques disponibles</p>
          <p className="hint">Arrastra los bloques al área de construcción en el orden correcto</p>
          <div className="blocksList">
            {availableBlocks.map(block => (
              <div
                key={block.id}
                className={`block ${placedBlocks.includes(block.id) ? 'blockUsed' : ''}`}
                draggable={!placedBlocks.includes(block.id)}
                onDragStart={e => handleDragStart(e, block.id)}
                style={{ '--block-color': block.color }}
                role="button"
                tabIndex={placedBlocks.includes(block.id) ? -1 : 0}
                aria-label={`Bloque: ${block.label}`}
                aria-disabled={placedBlocks.includes(block.id)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !placedBlocks.includes(block.id)) {
                    if (placedBlocks.length < neededBlockIds.length) {
                      setPlacedBlocks(prev => [...prev, block.id])
                      setBuildState(BuildState.BUILT)
                    }
                  }
                }}
              >
                <code className="blockCode">{block.label}</code>
                <span className="blockDesc">{block.desc}</span>
              </div>
            ))}
          </div>
        </aside>

        <section className="dropZoneWrapper" aria-label="Zona de construcción">
          <div className="dropZoneHeader">
            <p className="sectionLabel">Tu algoritmo</p>
            {placedBlocks.length > 0 && (
              <button className="resetBtn" onClick={handleReset}>
                Limpiar
              </button>
            )}
          </div>

          <div
            className={`dropZone ${buildState === BuildState.SUCCESS ? 'dropZoneSuccess' : ''} ${buildState === BuildState.ERROR ? 'dropZoneError' : ''}`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            aria-label="Zona de soltar bloques"
            aria-dropeffect="copy"
          >
            {placedBlocks.length === 0 ? (
              <div className="dropPlaceholder">
                <span className="dropIcon">📦</span>
                <p>Arrastra bloques aquí</p>
              </div>
            ) : (
              <div className="placedBlocksList">
                {placedBlocks.map((blockId, index) => {
                  const block = ALL_BLOCKS[blockId]
                  return (
                    <div
                      key={`${blockId}-${index}`}
                      className="placedBlock"
                      style={{ '--block-color': block.color }}
                    >
                      <span className="placedBlockNum">{index + 1}</span>
                      <code className="blockCode">{block.label}</code>
                      <button
                        className="removeBtn"
                        onClick={() => handleRemoveBlock(index)}
                        aria-label={`Eliminar bloque ${block.label}`}
                      >
                        ×
                      </button>
                    </div>
                  )
                })}

                {placedBlocks.length < neededBlockIds.length && (
                  <div className="remainingSlots">
                    {neededBlockIds.length - placedBlocks.length} bloque(s) más
                  </div>
                )}
              </div>
            )}
          </div>

          {buildState === BuildState.SUCCESS && (
            <div className="feedbackSuccess" role="alert">
              Correcto, lanzando carrera...
            </div>
          )}
          {buildState === BuildState.ERROR && (
            <div className="feedbackError" role="alert">
              Orden incorrecto, puedes intentarlo nuevamente.
            </div>
          )}

          <button
            className="btn-primary"
            style={{ width: '100%', marginTop: 12, justifyContent: 'center' }}
            onClick={handleVerify}
            disabled={placedBlocks.length !== neededBlockIds.length || buildState === BuildState.SUCCESS}
          >
            Verificar algoritmo
          </button>
        </section>
      </div>

      <section className="arrayPreview" aria-label="Arreglo a ordenar">
        <div className="arrayPreviewHeader">
          <p className="sectionLabel">Arreglo a ordenar</p>
          <button className="resetBtn" onClick={onNewArray}>
            Nuevo arreglo
          </button>
        </div>
        <div className="bars" role="img" aria-label={`Arreglo con ${array.length} elementos`}>
          {array.map((value, i) => (
            <div key={i} className="barWrapper">
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
          ))}
        </div>
      </section>
    </div>
  )
}