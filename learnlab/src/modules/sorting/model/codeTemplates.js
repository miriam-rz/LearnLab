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
