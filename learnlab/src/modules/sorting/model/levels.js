export const Levels = [
    {
        id: 1, 
        key: 'observe',
        title: 'Observa',
        description: 'Mira cómo funciona el algoritmo paso a paso. Entiende qué hace cada instrucción.',
        instruction: 'Selecciona un algoritmo y presiona Play. Observa cómo se ordena el arreglo.',
        mode: 'watch',
        unlockCondition: null,
        color: '#a78bfa',
    },
    {
        id: 2,
        key: 'complete',
        title: 'Completa',
        description: 'Rellena los huecos del código. Ya conoces la lógica, ahora practica escribirla.',
        instruction: 'Completa las partes que faltan en el código para que el algoritmo funcione.',
        mode: 'fill',
        unlockCondition: { level: 1, completed: true },
        color: '#34d399',
  },
  {
        id: 3,
        key: 'write',
        title: 'Escribe',
        description: 'Escribe el algoritmo completo desde cero. La visualización reacciona en tiempo real.',
        instruction: 'Escribe el código tú solo. El visualizador te muestra qué está pasando mientras escribes.',
        mode: 'code',
        unlockCondition: { level: 2, completed: true },
        color: '#fbbf24',
  },
]

export function getLevelById(id) {
  return Levels.find(l => l.id === id)
}

export function isLevelUnlocked(level, completedLevels) {
  if (!level.unlockCondition) return true
  return completedLevels.has(level.unlockCondition.level)
}