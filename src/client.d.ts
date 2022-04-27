type MathFn = (...args: any[]) => number

interface IndexExpressionItem {
  text: string;
  canvas: function;
  defaultExp: string;
}