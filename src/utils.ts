export function getMathFn(inputParam: string, expression: string): MathFn {
  const MathContext = `const {${Object.getOwnPropertyNames(Math).join(',')}}=Math`
  const formatExp = `()=>{
    ${MathContext};
    return (${ inputParam }) => {
      return ${expression}
    }
  }`
  // todo: fix this
  // return ${expression.replace(/(\d+)(\w+)/g, (_, n, x) => `${n} * ${x}`)}
  return eval(formatExp)()
}