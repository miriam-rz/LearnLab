function executeUserCode(code, array) {
  const arrCopy = [...array]

  const fn = new Function('arr', `
    "use strict";
    ${code}
    return arr;
  `)

  return fn(arrCopy)
}
