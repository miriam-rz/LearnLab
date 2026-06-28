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
