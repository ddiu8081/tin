type ColorArr = [number, number, number]

interface ColorDictItem {
  foreground: number
  background: string
  plus: ColorArr
  minus: ColorArr
}

interface ColorDict {
  light: ColorDictItem
  dark: ColorDictItem
}

const colorDict: ColorDict = {
  light: {
    foreground: 80,
    background: '#fafafa',
    plus: [148, 180, 159],
    minus: [180, 180, 180],
  },
  dark: {
    foreground: 220,
    background: '#1e1e1e',
    plus: [148, 180, 159],
    minus: [100, 100, 100],
  },
}

export default colorDict