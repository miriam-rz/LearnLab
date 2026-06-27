export const StepType = {
  COMPARE: 'compare',   
  SWAP:    'swap',     
  SORTED:  'sorted',  
  IDLE:    'idle',      
}

// 
//BUBBLE SORT
// 
// Complexity: O(n²)
// Compares adjacent pairs and interchangeable pairs if they are in the wrong order.
// The largest element "bubbles" to the end on each pass.

export function bubbleSortSteps(inputArray) {
 
  const arr = [...inputArray]
  const steps = []
  const n = arr.length
  const sortedIndices = new Set()  

  for (let i = 0; i < n - 1; i++) {
    let swapped = false

    for (let j = 0; j < n - i - 1; j++) {
      steps.push({
        array: [...arr],
        highlights: { [j]: StepType.COMPARE, [j + 1]: StepType.COMPARE },
        sortedIndices: new Set(sortedIndices),
        description: `Comparando ${arr[j]} y ${arr[j + 1]}`,
      })

      if (arr[j] > arr[j + 1]) {
        ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
        swapped = true

        steps.push({
          array: [...arr],
          highlights: { [j]: StepType.SWAP, [j + 1]: StepType.SWAP },
          sortedIndices: new Set(sortedIndices),
          description: `Intercambiando — ${arr[j]} y ${arr[j + 1]}`,
        })
      }
    }

    sortedIndices.add(n - 1 - i)

    if (!swapped) break
  }

  for (let i = 0; i < n; i++) sortedIndices.add(i)
  steps.push({
    array: [...arr],
    highlights: {},
    sortedIndices: new Set(sortedIndices),
    description: '¡Ordenado!',
  })

  return steps
}


//
// SELECTION SORT
//
// Complexity: O(n²)
// On each pass, it finds the minimum of the unsorted part
// and places it in its correct position.

export function selectionSortSteps(inputArray) {
  const arr = [...inputArray]
  const steps = []
  const n = arr.length
  const sortedIndices = new Set()

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i

    for (let j = i + 1; j < n; j++) {
      steps.push({
        array: [...arr],
        highlights: {
          [minIdx]: StepType.COMPARE,
          [j]: StepType.COMPARE,
        },
        sortedIndices: new Set(sortedIndices),
        description: `Buscando mínimo: comparando ${arr[minIdx]} y ${arr[j]}`,
      })

      if (arr[j] < arr[minIdx]) {
        minIdx = j  
      }
    }
    if (minIdx !== i) {
      ;[arr[i], arr[minIdx]] = [arr[minIdx], arr[i]]

      steps.push({
        array: [...arr],
        highlights: { [i]: StepType.SWAP, [minIdx]: StepType.SWAP },
        sortedIndices: new Set(sortedIndices),
        description: `Mínimo encontrado: colocando ${arr[i]} en posición ${i}`,
      })
    }

    sortedIndices.add(i)
  }

  sortedIndices.add(n - 1)
  steps.push({
    array: [...arr],
    highlights: {},
    sortedIndices: new Set(sortedIndices),
    description: '¡Ordenado!',
  })

  return steps
}

//
// INSERTION SORT 
//
// Complexity: O(n) best case, O(n²) worst case
// Takes each element and inserts it into the correct position within the already sorted part.

export function insertionSortSteps(inputArray) {
  const arr = [...inputArray]
  const steps = []
  const n = arr.length
  const sortedIndices = new Set([0])

  for (let i = 1; i < n; i++) {
    const key = arr[i]
    let j = i - 1

    steps.push({
      array: [...arr],
      highlights: { [i]: StepType.COMPARE },
      sortedIndices: new Set(sortedIndices),
      description: `Insertando ${key} en la posición correcta`,
    })
    while (j >= 0 && arr[j] > key) {
      steps.push({
        array: [...arr],
        highlights: { [j]: StepType.COMPARE, [j + 1]: StepType.SWAP },
        sortedIndices: new Set(sortedIndices),
        description: `${arr[j]} > ${key}, desplazando`,
      })

      arr[j + 1] = arr[j]
      j--
    }

    arr[j + 1] = key
    sortedIndices.add(i)

    steps.push({
      array: [...arr],
      highlights: { [j + 1]: StepType.SORTED },
      sortedIndices: new Set(sortedIndices),
      description: `${key} colocado en posición ${j + 1}`,
    })
  }

  for (let i = 0; i < n; i++) sortedIndices.add(i)
  steps.push({
    array: [...arr],
    highlights: {},
    sortedIndices: new Set(sortedIndices),
    description: '¡Ordenado!',
  })

  return steps
}

//
// MERGE SORT 
//
// Complexity: O(n log n) always — the most efficient modulo
// How it works (divide and conquer):
// 1. Divide the array into two halves
// 2. Sort each half recursively
// 3. Merge the two sorted halves

export function mergeSortSteps(inputArray) {
  const arr = [...inputArray]
  const steps = []
  const n = arr.length
  const sortedIndices = new Set()
 
  function mergeSort(left, right) {
    if (right - left <= 1) return
 
    const mid = Math.floor((left + right) / 2)
 
    steps.push({
      array: [...arr],
      highlights: buildRangeHighlight(left, right, StepType.COMPARE),
      sortedIndices: new Set(sortedIndices),
      description: `Dividiendo posiciones ${left} a ${right - 1}`,
    })
 
    mergeSort(left, mid)
    mergeSort(mid, right)
    merge(left, mid, right)
  }
 
  function merge(left, mid, right) {
    const leftArr  = arr.slice(left, mid)
    const rightArr = arr.slice(mid, right)
 
    let i = 0  
    let j = 0 
    let k = left  
 
    while (i < leftArr.length && j < rightArr.length) {
      steps.push({
        array: [...arr],
        highlights: { [left + i]: StepType.COMPARE, [mid + j]: StepType.COMPARE },
        sortedIndices: new Set(sortedIndices),
        description: `Comparando ${leftArr[i]} y ${rightArr[j]}`,
      })
 
      if (leftArr[i] <= rightArr[j]) {
        arr[k] = leftArr[i]
        i++
      } else {
        arr[k] = rightArr[j]
        j++
      }
 
      steps.push({
        array: [...arr],
        highlights: { [k]: StepType.SWAP },
        sortedIndices: new Set(sortedIndices),
        description: `Colocando ${arr[k]} en posición ${k}`,
      })
 
      k++
    }

    while (i < leftArr.length) {
      arr[k] = leftArr[i]
      steps.push({
        array: [...arr],
        highlights: { [k]: StepType.SORTED },
        sortedIndices: new Set(sortedIndices),
        description: `Copiando ${arr[k]} al arreglo`,
      })
      i++
      k++
    }

    while (j < rightArr.length) {
      arr[k] = rightArr[j]
      steps.push({
        array: [...arr],
        highlights: { [k]: StepType.SORTED },
        sortedIndices: new Set(sortedIndices),
        description: `Copiando ${arr[k]} al arreglo`,
      })
      j++
      k++
    }
 
    for (let x = left; x < right; x++) sortedIndices.add(x)
  }
 
  mergeSort(0, n)
 
  steps.push({
    array: [...arr],
    highlights: {},
    sortedIndices: new Set(Array.from({ length: n }, (_, i) => i)),
    description: '¡Ordenado!',
  })
 
  return steps
}


export const ALGORITHMS = {
  bubble: {
    id: 'bubble',
    name: 'Bubble Sort',
    color: '#a78bfa',  
    description: 'Compara pares adyacentes y los intercambia. Simple pero lento.',
    complexity: 'O(n²)',
    generateSteps: bubbleSortSteps,
    correctBlocks: ['outer-loop', 'inner-loop', 'compare', 'swap'],
  },
  selection: {
    id: 'selection',
    name: 'Selection Sort',
    color: '#34d399',
    description: 'Encuentra el mínimo y lo coloca al inicio. Siempre O(n²).',
    complexity: 'O(n²)',
    generateSteps: selectionSortSteps,
    correctBlocks: ['outer-loop', 'find-min', 'update-min', 'swap'],
  },
  insertion: {
    id: 'insertion',
    name: 'Insertion Sort',
    color: '#fbbf24', 
    description: 'Inserta cada elemento en su lugar.',
    complexity: 'O(n) — O(n²)',
    generateSteps: insertionSortSteps,
    correctBlocks: ['outer-loop', 'store-key', 'shift-right', 'insert'],
  },
    merge: {
    id: 'merge',
    name: 'Merge Sort',
    color: '#60a5fa',
    description: 'Divide el arreglo en mitades, ordena cada una y las combina. Siempre O(n log n).',
    complexity: 'O(n log n)',
    generateSteps: mergeSortSteps,
    correctBlocks: ['divide', 'recurse-left', 'recurse-right', 'merge'],
  },

}

export function generateRandomArray(n = 12, min = 5, max = 95) {
  return Array.from({ length: n }, () =>
    Math.floor(Math.random() * (max - min + 1)) + min
  )
}

export function generateNearlySortedArray(n = 12) {
  const arr = Array.from({ length: n }, (_, i) => Math.round((i + 1) * (90 / n)) + 5)
  for (let k = 0; k < 2; k++) {
    const i = Math.floor(Math.random() * n)
    const j = Math.floor(Math.random() * n)
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function buildRangeHighlight(left, right, type) {
  const highlights = {}
  for (let i = left; i < right; i++) highlights[i] = type
  return highlights
}
