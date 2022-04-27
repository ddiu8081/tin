export function getMathFn(inputParm: string, expression: string): MathFn {
  const MathContext = `const {${Object.getOwnPropertyNames(Math).join(',')}}=Math`
  const formatExp = `()=>{
    ${MathContext};
    return (${ inputParm }) => {
      return ${expression.replace(/(\d+)(\w+)/g, (_, n, x) => `${n} * ${x}`)}
    }
  }`
  return eval(formatExp)()
}