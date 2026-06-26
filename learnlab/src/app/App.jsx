import { useState } from 'react'
import SortingModule from '../modules/sorting/SortingModule.jsx'
import './App.css'

const MODULES = [
  {
    id: 'sorting',
    name: 'Ordenamiento',
    icon: '⚡',
    color: '#a78bfa',
    colorBg: '#1e1b3a',
    description: 'Construye Bubble Sort o Selection Sort arrastrando bloques. Luego observa una carrera en tiempo real.',
    status: 'available',
    component: SortingModule,
  },
  {
    id: 'pathfinding',
    name: 'Pathfinding',
    icon: '🗺️',
    color: '#34d399',
    colorBg: '#0d2d1a',
    description: 'Dibuja laberintos y visualiza cómo BFS, DFS y A* encuentran el camino más corto.',
    status: 'soon',
    component: null,
  },
  {
    id: 'trees',
    name: 'Árboles',
    icon: '🌲',
    color: '#fbbf24',
    colorBg: '#2d1f0d',
    description: 'Inserta, elimina y busca nodos. Visualiza BST, AVL y árboles rojo-negro balancearse solos.',
    status: 'soon',
    component: null,
  },
]

function App() {
  const [activeModule, setActiveModule] = useState(null)
  const currentModule = MODULES.find(module => module.id === activeModule)

  if (currentModule?.component) {
    const ModuleComponent = currentModule.component
    return <ModuleComponent onBack={() => setActiveModule(null)} />
  }

  return (
    <div className="app">
      <nav className="nav">
        <div className="logo">
          Learn<span>Lab</span>
        </div>
        <p className="navSub">Visualizador de algoritmos</p>
      </nav>
      <main className="main">
        <header className="hero">
          <div className="heroTag">🎓 Proyecto educativo</div>
          <h1 className="heroTitle"> Aprende <em>algoritmos</em><br />jugando </h1>
          <p className="heroSub"> Construye, ejecuta y compara algoritmos con animaciones en tiempo real. </p>
        </header>
        <section className="grid" aria-label="Módulos disponibles">
          {MODULES.map((mod, index) => (
            <ModuleCard
              key={mod.id}
              module={mod}
              featured={index === 0}
              onClick={() => {
                if (mod.status === 'available') {
                  setActiveModule(mod.id)
                }
              }}
            />
          ))}
        </section>
        <footer className="stats">
          <Stat value="3" label="Módulos" />
          <Stat value="8+" label="Algoritmos" />
        </footer>
      </main>
    </div>
  )
}

function ModuleCard({ module, featured, onClick }) {
  const available = module.status === 'available'
  return (
    <article
      className={`card ${featured ? 'featured' : ''} ${!available ? 'cardDisabled' : ''}`}
      onClick={onClick}
      role={available ? 'button' : 'article'}
      tabIndex={available ? 0 : undefined}
      onKeyDown={e => {
        if (available && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          onClick()
        }
      }}
      aria-label={available ? `Abrir módulo ${module.name}` : `${module.name} — próximamente`}
      style={{ '--card-color': module.color, '--card-bg': module.colorBg }}
    >
      <div className="cardGlow" aria-hidden="true" />
      <span className="cardIcon" aria-hidden="true">{module.icon}</span>
      <div className="cardLabel" style={{ color: module.color }}>
        {module.name}
      </div>
      <p className="cardDesc">{module.description}</p>
    </article>
  )
}

function Stat({ value, label }) {
  return (
    <div className="stat">
      <span className="statValue">{value}</span>
      <span className="statLabel">{label}</span>
    </div>
  )
}

export default App