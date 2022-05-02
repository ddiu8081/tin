const replaceReg = (rawExpression: string) => {
  const reg = /(\d+)([a-zA-Z]+)/g
  return rawExpression.replace(reg, (_, p1, p2) => `${p1} * ${p2}`)
}

export function getMathFn(inputParam: string, expression: string): MathFn {
  const MathContext = `const {${Object.getOwnPropertyNames(Math).join(',')}}=Math`

  const formatExp = `() => {
    ${MathContext};
    return (${ inputParam }) => {
      return ${replaceReg(expression)};
    }
  }`
  return eval(formatExp)()
}