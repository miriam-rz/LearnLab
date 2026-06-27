export const Stage = {
  EMPTY:       'empty',        
  OUTER_LOOP:  'outer-loop',   
  INNER_LOOP:  'inner-loop',   
  COMPARE:     'compare',     
  SWAP:        'swap',         
  COMPLETE:    'complete',     
  UNKNOWN:     'unknown',      
}

const PATTERNS = {
  bubble: [
    {
      stage: Stage.COMPLETE,
      pattern: /for\s*\(.*\)\s*\{[\s\S]*for\s*\(.*\)\s*\{[\s\S]*if\s*\([\s\S]*\)\s*\{[\s\S]*(temp|swap)[\s\S]*\}/i,
      progress: 1.0,
      message: '¡Algoritmo completo detectado! Corriendo la animación...',
    },
    {
      stage: Stage.SWAP,
      pattern: /const\s+temp\s*=|arr\[j\]\s*=\s*arr\[j\s*\+\s*1\]|swap/i,
      progress: 0.8,
      message: 'Detecté un intercambio — las barras van a cambiar de lugar.',
    },
    {
      stage: Stage.COMPARE,
      pattern: /if\s*\(\s*arr\s*\[/i,
      progress: 0.6,
      message: 'Detecté una comparación — voy a resaltar los dos elementos.',
    },
    {
      stage: Stage.INNER_LOOP,
      pattern: /for\s*\(.*\)\s*\{[\s\S]*for\s*\(/i,
      progress: 0.4,
      message: 'Detecté el bucle interior — comparando pares adyacentes.',
    },
    {
      stage: Stage.OUTER_LOOP,
      pattern: /for\s*\(\s*let\s+\w+\s*=/i,
      progress: 0.2,
      message: 'Detecté el bucle exterior — vamos a iterar sobre el arreglo.',
    },
  ],

  selection: [
    {
      stage: Stage.COMPLETE,
      pattern: /for\s*\(.*\)\s*\{[\s\S]*min[\s\S]*for\s*\(.*\)\s*\{[\s\S]*if[\s\S]*(temp|swap)[\s\S]*\}/i,
      progress: 1.0,
      message: '¡Algoritmo completo! Corriendo Selection Sort...',
    },
    {
      stage: Stage.SWAP,
      pattern: /const\s+temp\s*=\s*arr\[i\]|arr\[i\]\s*=\s*arr\[min/i,
      progress: 0.8,
      message: 'Detecté el intercambio del mínimo a su posición correcta.',
    },
    {
      stage: Stage.COMPARE,
      pattern: /if\s*\(\s*arr\s*\[j\]\s*</i,
      progress: 0.6,
      message: 'Detecté la comparación para encontrar el mínimo.',
    },
    {
      stage: Stage.INNER_LOOP,
      pattern: /min\w*\s*=\s*\w+[\s\S]*for\s*\(/i,
      progress: 0.4,
      message: 'Detecté la búsqueda del mínimo.',
    },
    {
      stage: Stage.OUTER_LOOP,
      pattern: /for\s*\(\s*let\s+\w+\s*=/i,
      progress: 0.2,
      message: 'Detecté el bucle exterior.',
    },
  ],

  insertion: [
    {
      stage: Stage.COMPLETE,
      pattern: /for\s*\(.*\)\s*\{[\s\S]*key[\s\S]*while\s*\([\s\S]*\)\s*\{[\s\S]*\}/i,
      progress: 1.0,
      message: '¡Algoritmo completo! Corriendo Insertion Sort...',
    },
    {
      stage: Stage.SWAP,
      pattern: /arr\[j\s*\+\s*1\]\s*=\s*key/i,
      progress: 0.8,
      message: 'Detecté la inserción de key en su posición correcta.',
    },
    {
      stage: Stage.COMPARE,
      pattern: /while\s*\(\s*j\s*>=\s*0/i,
      progress: 0.6,
      message: 'Detecté el desplazamiento de elementos hacia la derecha.',
    },
    {
      stage: Stage.INNER_LOOP,
      pattern: /const\s+key\s*=\s*arr\[\w+\]/i,
      progress: 0.4,
      message: 'Detecté que guardas el elemento a insertar.',
    },
    {
      stage: Stage.OUTER_LOOP,
      pattern: /for\s*\(\s*let\s+\w+\s*=\s*1/i,
      progress: 0.2,
      message: 'Detecté el bucle exterior — empieza desde el segundo elemento.',
    },
  ],

  merge: [
    {
      stage: Stage.COMPLETE,
      pattern: /function\s+\w+\s*\([\s\S]*\)\s*\{[\s\S]*if[\s\S]*length[\s\S]*mid[\s\S]*merge[\s\S]*\}/i,
      progress: 1.0,
      message: '¡Algoritmo completo! Corriendo Merge Sort...',
    },
    {
      stage: Stage.SWAP,
      pattern: /result\s*\.\s*push|result\s*\.\s*concat/i,
      progress: 0.8,
      message: 'Detecté la fase de combinación (merge) de las dos mitades.',
    },
    {
      stage: Stage.COMPARE,
      pattern: /while\s*\(\s*\w+\s*\.\s*length\s*&&/i,
      progress: 0.6,
      message: 'Detecté la comparación elemento por elemento en el merge.',
    },
    {
      stage: Stage.INNER_LOOP,
      pattern: /slice\s*\(\s*0\s*,\s*mid\s*\)|slice\s*\(\s*mid\s*\)/i,
      progress: 0.4,
      message: 'Detecté la división en dos mitades.',
    },
    {
      stage: Stage.OUTER_LOOP,
      pattern: /const\s+mid\s*=\s*Math\s*\.\s*floor/i,
      progress: 0.2,
      message: 'Detecté el cálculo del punto medio.',
    },
  ],
}

export function parseCode(text, algorithmId) {
  if (typeof text !== 'string')           return buildResult(Stage.EMPTY, 0, '')
  if (text.trim().length === 0)           return buildResult(Stage.EMPTY, 0, '')
  if (text.length > 2000)                 return buildResult(Stage.UNKNOWN, 0, 'El código es demasiado largo.')
  if (!PATTERNS[algorithmId])             return buildResult(Stage.UNKNOWN, 0, '')

  const patterns = PATTERNS[algorithmId]

  for (const { stage, pattern, progress, message } of patterns) {
    if (pattern.test(text)) {
      return buildResult(stage, progress, message)
    }
  }

  return buildResult(Stage.UNKNOWN, 0, 'Sigue escribiendo, aún no reconozco el patrón.')
}

export function getHighlightsForStage(stage, array) {
  const n = array.length
  if (n === 0) return {}

  switch (stage) {
    case Stage.OUTER_LOOP: {
      return array.reduce((acc, _, i) => ({ ...acc, [i]: 'outer' }), {})
    }
    case Stage.INNER_LOOP: {
      const mid = Math.floor(n / 2)
      return { [mid]: 'compare', [mid + 1]: 'compare' }
    }
    case Stage.COMPARE: {
      const mid = Math.floor(n / 3)
      return { [mid]: 'compare', [mid + 1]: 'compare' }
    }
    case Stage.SWAP: {
      const a = Math.floor(n / 4)
      const b = Math.floor(n * 3 / 4)
      return { [a]: 'swap', [b]: 'swap' }
    }
    case Stage.COMPLETE: {
      return array.reduce((acc, _, i) => ({ ...acc, [i]: 'sorted' }), {})
    }
    default:
      return {}
  }
}

function buildResult(stage, progress, message) {
  return { stage, progress, message }
}