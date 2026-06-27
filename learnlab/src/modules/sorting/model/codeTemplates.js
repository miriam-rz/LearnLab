// Data Architecture:
// Each algorithm has 3 CHALLENGES in sequence.
// Each challenge has 2-3 VARIANTS — one is chosen randomly.
// Each variant has LINES of code, some of which are GAPS.
// Types of gaps:
// 'write' — the user writes the answer
// 'select' — the user chooses from options

import { validateInput } from '../../../shared/lib/inputValidator.js'
export { validateInput }

export function pickVariant(variants) {
  const index = Math.floor(Math.random() * variants.length)
  return { ...variants[index], variantIndex: index }
}

// BUBBLE SORT 
const bubbleRetos = [
  {
    id: 'bubble-reto-1',
    title: 'Reto 1 — Estructura de bucles',
    description: 'Completa los límites de los bucles de Bubble Sort.',
    highlightStage: 'loops',
    variants: [
      {
        explanation: 'El bucle exterior controla cuántas pasadas hacemos.',
        lines: [
          { code: 'for (let i = 0; i < ', blank: null },
          { code: null, blank: { id: 'b1a-1', type: 'write', answer: 'n - 1', alternatives: ['n-1', 'n- 1', 'n -1'], hint: 'El arreglo tiene n elementos. ¿Cuántas pasadas necesitas?' } },
          { code: '; i++) {', blank: null },
          { code: '  for (let j = 0; j < n - i - 1; j++) {', blank: null },
          { code: '    // comparar e intercambiar', blank: null },
          { code: '  }', blank: null },
          { code: '}', blank: null },
        ],
      },
      {
        explanation: 'El bucle interior compara pares adyacentes. Su límite cambia en cada pasada.',
        lines: [
          { code: 'for (let i = 0; i < n - 1; i++) {', blank: null },
          { code: '  for (let j = 0; j < ', blank: null },
          { code: null, blank: { id: 'b1b-1', type: 'select', answer: 'n - i - 1', alternatives: ['n-i-1'], options: ['n - 1', 'n - i - 1', 'n - i', 'n'], hint: '¿Por qué el límite interior decrece con cada pasada?' } },
          { code: '; j++) {', blank: null },
          { code: '    // comparar e intercambiar', blank: null },
          { code: '  }', blank: null },
          { code: '}', blank: null },
        ],
      },
    ],
  },
  {
    id: 'bubble-reto-2',
    title: 'Reto 2 — Comparar e intercambiar',
    description: 'Completa la condición de comparación y el intercambio.',
    highlightStage: 'compare-swap',
    variants: [
      {
        explanation: 'Bubble Sort intercambia cuando el elemento izquierdo es mayor que el derecho.',
        lines: [
          { code: 'if (', blank: null },
          { code: null, blank: { id: 'b2a-1', type: 'select', answer: 'arr[j] > arr[j + 1]', alternatives: ['arr[j]>arr[j+1]'], options: ['arr[j] > arr[j + 1]', 'arr[j] < arr[j + 1]', 'arr[j] >= arr[j + 1]', 'arr[i] > arr[j]'], hint: '¿Cuándo deben intercambiarse dos elementos adyacentes?' } },
          { code: ') {', blank: null },
          { code: '  const temp = arr[j]', blank: null },
          { code: '  arr[j] = arr[j + 1]', blank: null },
          { code: '  arr[j + 1] = temp', blank: null },
          { code: '}', blank: null },
        ],
      },
      {
        explanation: 'Para intercambiar dos valores necesitas una variable temporal.',
        lines: [
          { code: 'if (arr[j] > arr[j + 1]) {', blank: null },
          { code: '  const temp = ', blank: null },
          { code: null, blank: { id: 'b2b-1', type: 'write', answer: 'arr[j]', alternatives: ['arr[ j ]', 'arr[j ]', 'arr[ j]'], hint: '¿Qué valor guardas primero para no perderlo?' } },
          { code: null, blank: null },
          { code: '  arr[j] = arr[j + 1]', blank: null },
          { code: '  arr[j + 1] = ', blank: null },
          { code: null, blank: { id: 'b2b-2', type: 'write', answer: 'temp', alternatives: ['temp '], hint: '¿Qué variable tiene el valor original de arr[j]?' } },
          { code: '}', blank: null },
        ],
      },
    ],
  },
  {
    id: 'bubble-reto-3',
    title: 'Reto 3 — Algoritmo completo',
    description: 'Completa el algoritmo entero. Mezcla de escritura y selección.',
    highlightStage: 'full',
    variants: [
      {
        explanation: 'Esta versión tiene una optimización: si no hay intercambios en una pasada, el arreglo ya está ordenado.',
        lines: [
          { code: 'for (let i = 0; i < n - 1; i++) {', blank: null },
          { code: '  let swapped = ', blank: null },
          { code: null, blank: { id: 'b3a-1', type: 'select', answer: 'false', alternatives: [], options: ['false', 'true', '0', 'null'], hint: 'Al inicio de cada pasada, ¿hubo intercambios?' } },
          { code: '  for (let j = 0; j < n - i - 1; j++) {', blank: null },
          { code: '    if (arr[j] > arr[j + 1]) {', blank: null },
          { code: '      const temp = arr[j]', blank: null },
          { code: '      arr[j] = arr[j + 1]', blank: null },
          { code: '      arr[j + 1] = temp', blank: null },
          { code: '      swapped = ', blank: null },
          { code: null, blank: { id: 'b3a-2', type: 'write', answer: 'true', alternatives: ['true '], hint: 'Marca que sí hubo un intercambio en esta pasada.' } },
          { code: '    }', blank: null },
          { code: '  }', blank: null },
          { code: '  if (!swapped) ', blank: null },
          { code: null, blank: { id: 'b3a-3', type: 'select', answer: 'break', alternatives: [], options: ['break', 'return', 'continue', 'stop'], hint: '¿Cómo sales del bucle si ya está ordenado?' } },
          { code: '}', blank: null },
        ],
      },
      {
        explanation: 'La versión más simple de Bubble Sort, sin optimización.',
        lines: [
          { code: 'for (let i = 0; i < ', blank: null },
          { code: null, blank: { id: 'b3b-1', type: 'write', answer: 'n - 1', alternatives: ['n-1'], hint: '¿Cuántas pasadas necesita Bubble Sort?' } },
          { code: '; i++) {', blank: null },
          { code: '  for (let j = 0; j < ', blank: null },
          { code: null, blank: { id: 'b3b-2', type: 'select', answer: 'n - i - 1', alternatives: ['n-i-1'], options: ['n - 1', 'n - i - 1', 'n - i', 'j + 1'], hint: 'El mayor ya está al final, no necesitas revisarlo.' } },
          { code: '; j++) {', blank: null },
          { code: '    if (arr[j] > arr[j + 1]) {', blank: null },
          { code: '      const temp = arr[j]', blank: null },
          { code: '      arr[j] = ', blank: null },
          { code: null, blank: { id: 'b3b-3', type: 'write', answer: 'arr[j + 1]', alternatives: ['arr[j+1]', 'arr[ j + 1 ]'], hint: '¿Qué valor va en la posición j?' } },
          { code: '      arr[j + 1] = temp', blank: null },
          { code: '    }', blank: null },
          { code: '  }', blank: null },
          { code: '}', blank: null },
        ],
      },
    ],
  },
]
// SELECTION SORT 
const selectionRetos = [
  {
    id: 'selection-reto-1',
    title: 'Reto 1 — Encontrar el mínimo',
    description: 'Completa la lógica para encontrar el índice del elemento mínimo.',
    highlightStage: 'find-min',
    variants: [
      {
        explanation: 'Selection Sort guarda el índice del mínimo, no el valor.',
        lines: [
          { code: 'let minIdx = ', blank: null },
          { code: null, blank: { id: 's1a-1', type: 'write', answer: 'i', alternatives: ['i '], hint: 'Al inicio de cada pasada, el mínimo asumido es el primer elemento no ordenado.' } },
          { code: 'for (let j = i + 1; j < n; j++) {', blank: null },
          { code: '  if (arr[j] < ', blank: null },
          { code: null, blank: { id: 's1a-2', type: 'select', answer: 'arr[minIdx]', alternatives: [], options: ['arr[minIdx]', 'arr[i]', 'arr[j - 1]', 'minIdx'], hint: '¿Con qué valor comparas para saber si encontraste un nuevo mínimo?' } },
          { code: ') {', blank: null },
          { code: '    minIdx = j', blank: null },
          { code: '  }', blank: null },
          { code: '}', blank: null },
        ],
      },
      {
        explanation: 'La actualización del mínimo solo ocurre si encontramos algo menor.',
        lines: [
          { code: 'let minIdx = i', blank: null },
          { code: 'for (let j = i + 1; j < n; j++) {', blank: null },
          { code: '  if (arr[j] < arr[minIdx]) {', blank: null },
          { code: '    minIdx = ', blank: null },
          { code: null, blank: { id: 's1b-1', type: 'select', answer: 'j', alternatives: [], options: ['j', 'i', 'minIdx', 'j - 1'], hint: '¿Cuál es el índice del nuevo mínimo que encontraste?' } },
          { code: '  }', blank: null },
          { code: '}', blank: null },
        ],
      },
    ],
  },
  {
    id: 'selection-reto-2',
    title: 'Reto 2 — El intercambio condicional',
    description: 'Selection Sort solo intercambia si el mínimo no es el elemento actual.',
    highlightStage: 'swap',
    variants: [
      {
        explanation: 'Si el mínimo ya está en su lugar, no hay que intercambiar.',
        lines: [
          { code: 'if (minIdx !== ', blank: null },
          { code: null, blank: { id: 's2a-1', type: 'write', answer: 'i', alternatives: ['i '], hint: '¿Con qué posición comparas para saber si ya está en su lugar?' } },
          { code: ') {', blank: null },
          { code: '  const temp = arr[i]', blank: null },
          { code: '  arr[i] = ', blank: null },
          { code: null, blank: { id: 's2a-2', type: 'select', answer: 'arr[minIdx]', alternatives: [], options: ['arr[minIdx]', 'arr[i]', 'arr[j]', 'temp'], hint: '¿Qué valor pones en la posición i?' } },
          { code: '  arr[minIdx] = temp', blank: null },
          { code: '}', blank: null },
        ],
      },
      {
        explanation: 'Completa el intercambio completo.',
        lines: [
          { code: 'if (minIdx !== i) {', blank: null },
          { code: '  const temp = ', blank: null },
          { code: null, blank: { id: 's2b-1', type: 'write', answer: 'arr[i]', alternatives: ['arr[ i ]'], hint: '¿Qué valor guardas temporalmente?' } },
          { code: '  arr[i] = arr[minIdx]', blank: null },
          { code: '  arr[minIdx] = ', blank: null },
          { code: null, blank: { id: 's2b-2', type: 'write', answer: 'temp', alternatives: ['temp '], hint: '¿Qué variable tiene el valor original?' } },
          { code: '}', blank: null },
        ],
      },
    ],
  },
  {
    id: 'selection-reto-3',
    title: 'Reto 3 — Algoritmo completo',
    description: 'Completa Selection Sort de principio a fin.',
    highlightStage: 'full',
    variants: [
      {
        explanation: 'Selection Sort tiene un bucle exterior que avanza la frontera entre ordenado y no ordenado.',
        lines: [
          { code: 'for (let i = 0; i < ', blank: null },
          { code: null, blank: { id: 's3a-1', type: 'select', answer: 'n - 1', alternatives: ['n-1'], options: ['n', 'n - 1', 'n - 2', 'n + 1'], hint: 'El último elemento queda ordenado automáticamente.' } },
          { code: '; i++) {', blank: null },
          { code: '  let minIdx = i', blank: null },
          { code: '  for (let j = i + 1; j < n; j++) {', blank: null },
          { code: '    if (arr[j] < arr[minIdx]) minIdx = j', blank: null },
          { code: '  }', blank: null },
          { code: '  if (minIdx !== i) {', blank: null },
          { code: '    const temp = arr[i]', blank: null },
          { code: '    arr[i] = ', blank: null },
          { code: null, blank: { id: 's3a-2', type: 'write', answer: 'arr[minIdx]', alternatives: ['arr[minIdx ]', 'arr[ minIdx]'], hint: '¿Qué valor va en la posición i?' } },
          { code: '    arr[minIdx] = temp', blank: null },
          { code: '  }', blank: null },
          { code: '}', blank: null },
        ],
      },
    ],
  },
]

// INSERTION SORT 
const insertionRetos = [
  {
    id: 'insertion-reto-1',
    title: 'Reto 1 — Guardar la clave',
    description: 'Insertion Sort guarda el elemento actual antes de mover los demás.',
    highlightStage: 'key',
    variants: [
      {
        explanation: 'Guardamos arr[i] en key antes de que otros elementos lo sobreescriban.',
        lines: [
          { code: 'for (let i = 1; i < n; i++) {', blank: null },
          { code: '  const key = ', blank: null },
          { code: null, blank: { id: 'in1a-1', type: 'write', answer: 'arr[i]', alternatives: ['arr[ i ]'], hint: '¿Qué elemento estás intentando insertar en su lugar correcto?' } },
          { code: '  let j = i - 1', blank: null },
          { code: '  // mover elementos mayores que key', blank: null },
          { code: '}', blank: null },
        ],
      },
      {
        explanation: 'El índice j empieza justo antes del elemento actual.',
        lines: [
          { code: 'for (let i = 1; i < n; i++) {', blank: null },
          { code: '  const key = arr[i]', blank: null },
          { code: '  let j = ', blank: null },
          { code: null, blank: { id: 'in1b-1', type: 'select', answer: 'i - 1', alternatives: ['i-1'], options: ['i - 1', 'i', 'i + 1', '0'], hint: '¿Desde dónde empiezas a comparar hacia la izquierda?' } },
          { code: '  // mover elementos mayores que key', blank: null },
          { code: '}', blank: null },
        ],
      },
    ],
  },
  {
    id: 'insertion-reto-2',
    title: 'Reto 2 — Desplazar elementos',
    description: 'Mientras los elementos son mayores que key, los movemos a la derecha.',
    highlightStage: 'shift',
    variants: [
      {
        explanation: 'El while desplaza elementos hacia la derecha hasta encontrar el lugar correcto.',
        lines: [
          { code: 'while (j >= 0 && arr[j] > ', blank: null },
          { code: null, blank: { id: 'in2a-1', type: 'write', answer: 'key', alternatives: ['key '], hint: '¿Con qué valor comparas cada elemento de la parte ordenada?' } },
          { code: ') {', blank: null },
          { code: '  arr[j + 1] = arr[j]', blank: null },
          { code: '  j--', blank: null },
          { code: '}', blank: null },
          { code: 'arr[j + 1] = key', blank: null },
        ],
      },
      {
        explanation: 'Al salir del while, j + 1 es la posición correcta para key.',
        lines: [
          { code: 'while (j >= 0 && arr[j] > key) {', blank: null },
          { code: '  arr[j + 1] = ', blank: null },
          { code: null, blank: { id: 'in2b-1', type: 'select', answer: 'arr[j]', alternatives: [], options: ['arr[j]', 'arr[j + 1]', 'key', 'arr[j - 1]'], hint: '¿Qué valor desplazas una posición a la derecha?' } },
          { code: '  j--', blank: null },
          { code: '}', blank: null },
          { code: 'arr[', blank: null },
          { code: null, blank: { id: 'in2b-2', type: 'write', answer: 'j + 1', alternatives: ['j+1', 'j + 1 '], hint: '¿En qué posición insertas key al salir del while?' } },
          { code: '] = key', blank: null },
        ],
      },
    ],
  },
  {
    id: 'insertion-reto-3',
    title: 'Reto 3 — Algoritmo completo',
    description: 'Completa Insertion Sort de principio a fin.',
    highlightStage: 'full',
    variants: [
      {
        explanation: 'Insertion Sort empieza desde i = 1 porque el primer elemento ya está "ordenado".',
        lines: [
          { code: 'for (let i = ', blank: null },
          { code: null, blank: { id: 'in3a-1', type: 'select', answer: '1', alternatives: [], options: ['0', '1', '2', 'n - 1'], hint: '¿Por qué no empezamos desde i = 0?' } },
          { code: '; i < n; i++) {', blank: null },
          { code: '  const key = arr[i]', blank: null },
          { code: '  let j = i - 1', blank: null },
          { code: '  while (j >= 0 && arr[j] > key) {', blank: null },
          { code: '    arr[j + 1] = arr[j]', blank: null },
          { code: '    ', blank: null },
          { code: null, blank: { id: 'in3a-2', type: 'write', answer: 'j--', alternatives: ['j -= 1', 'j = j - 1'], hint: '¿Cómo avanzas j hacia la izquierda?' } },
          { code: '  }', blank: null },
          { code: '  arr[j + 1] = ', blank: null },
          { code: null, blank: { id: 'in3a-3', type: 'write', answer: 'key', alternatives: ['key '], hint: '¿Qué valor insertas en la posición correcta?' } },
          { code: '}', blank: null },
        ],
      },
    ],
  },
]



export const CODE_TEMPLATES = {
  bubble:    bubbleRetos,
  selection: selectionRetos,
  insertion: insertionRetos,
  merge:     mergeRetos,
}

export function buildSession(algorithmId) {
  const retos = CODE_TEMPLATES[algorithmId]
  if (!retos) return []
  return retos.map(reto => ({
    ...reto,
    activeVariant: pickVariant(reto.variants),
  }))
}
