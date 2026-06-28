const FORBIDDEN_TERMS = [
  'window',
  'document',
  'fetch',
  'XMLHttpRequest',
  'WebSocket',
  'localStorage',
  'sessionStorage',
  'indexedDB',
  'navigator',
  'location',
  'history',
  'importScripts',  
  'eval',
  'Function',
  '__proto__',
  'prototype',
  'constructor',
  'globalThis',
  'self.close',
]

function containsForbiddenTerms(code) {
  return FORBIDDEN_TERMS.some(term =>
    code.toLowerCase().includes(term.toLowerCase())
  )
}

function isValidCode(code) {
  if (typeof code !== 'string')  return false
  if (code.trim().length === 0)  return false
  if (code.length > 2000)        return false
  if (containsForbiddenTerms(code)) return false
  return true
}

function isValidArray(array) {
  if (!Array.isArray(array))        return false
  if (array.length === 0)           return false
  if (array.length > 100)           return false
  if (!array.every(n => typeof n === 'number' && Number.isFinite(n))) return false
  return true
}

function executeUserCode(code, array) {
  const arrCopy = [...array]

  const fn = new Function('arr', `
    "use strict";
    ${code}
    return arr;
  `)

  return fn(arrCopy)
}

function hasSameElements(original, result) {
  if (original.length !== result.length) return false
  const sortedOriginal = [...original].sort((a, b) => a - b)
  const sortedResult   = [...result].sort((a, b) => a - b)
  return sortedOriginal.every((v, i) => v === sortedResult[i])
}

function analyzeComplexity(code) {
  const hasNestedLoops   = /for[\s\S]*for/i.test(code) || /while[\s\S]*while/i.test(code)
  const hasRecursion     = /function\s+\w+[\s\S]*\1\s*\(/i.test(code)
  const hasEarlyBreak    = /break/i.test(code)
  const hasDivideConquer = /slice|splice|mid/i.test(code)

  if (hasDivideConquer && hasRecursion) {
    return {
      complexity: 'O(n log n)',
      message: '¡Excelente! Tu algoritmo usa divide y vencerás — muy eficiente.',
      level: 'great',
    }
  }
  if (hasNestedLoops && hasEarlyBreak) {
    return {
      complexity: 'O(n²) optimizado',
      message: 'Buena optimización — el break evita iteraciones innecesarias.',
      level: 'good',
    }
  }
  if (hasNestedLoops) {
    return {
      complexity: 'O(n²)',
      message: 'Funciona correctamente. Tip: ¿podrías agregar un break para salir antes si ya está ordenado?',
      level: 'ok',
    }
  }
  return {
    complexity: 'Desconocida',
    message: 'Solución válida. Analiza la complejidad de tiempo de tu enfoque.',
    level: 'ok',
  }
}


self.onmessage = function(event) {
    const { code, array } = event.data
    if (!isValidCode(code)) {
            self.postMessage({
            success: false,
            error: 'El código es inválido.',
            sorted: false,
        })
        return
    }

    if (!isValidArray(array)) {
            self.postMessage({
            success: false,
            error: 'El arreglo es inválido.',
            sorted: false,
        })
        return
    }


    let result
    let timedOut = false

    const timeoutId = setTimeout(() => {
            timedOut = true
            self.postMessage({
            success: false,
            error: 'Tu código tardó demasiado. ¿Tienes un loop infinito?',
            sorted: false,
        })
    }, 100)

    try {
        result = executeUserCode(code, array)
        clearTimeout(timeoutId)
    } catch (err) {
        clearTimeout(timeoutId)
        if (!timedOut) {
            self.postMessage({
                success: false,
                error: `Error en tu código: ${err.message}`,
                sorted: false,
            })
        }
        return
    }

  if (timedOut) return

    if (!Array.isArray(result)) {
            self.postMessage({
            success: false,
            error: 'Tu función debe retornar el arreglo modificado.',
            sorted: false,
        })
        return
    }

    if (!hasSameElements(array, result)) {
            self.postMessage({
            success: false,
            error: 'El arreglo resultante no contiene los mismos elementos. ¿Lo modificaste incorrectamente?',
            sorted: false,
        })
        return
    }

    const sorted = isSorted(result)

    if (!sorted) {
            self.postMessage({
            success: true,
            sorted: false,
            error: null,
            message: 'El arreglo no quedó ordenado correctamente. Revisa tu lógica.',
        })
        return
    }

    const analysis = analyzeComplexity(code)

    self.postMessage({
        success: true,
        sorted: true,
        error: null,
        result,
        analysis,
    })
}