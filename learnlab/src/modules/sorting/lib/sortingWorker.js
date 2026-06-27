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
