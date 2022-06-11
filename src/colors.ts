type ColorArr = [number, number, number]

interface ColorDictItem {
  plus: ColorArr
  minus: ColorArr
}

interface ColorDict {
  light: ColorDictItem
  dark: ColorDictItem
}

const colorDict: ColorDict = {
  light: {
    plus: [148, 180, 159],
    minus: [180, 180, 180],
  },
  dark: {
    plus: [148, 180, 159],
    minus: [100, 100, 100],
  },
}

export default colorDict