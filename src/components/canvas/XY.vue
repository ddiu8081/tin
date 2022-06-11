<script setup lang="ts">
import { onMounted, computed, watch } from 'vue'
import { watchDebounced, useElementSize } from '@vueuse/core'
import p5 from 'p5'

import { getMathFn, isDark } from '@/utils'
import colors from '@/colors'
import Spy from '@/components/Spy.vue'

interface Props {
  exp: string
}

const props = defineProps<Props>()

const dom = $ref(null)
const { width: canvasW } = $(useElementSize($$(dom)))
const currentTheme = computed<'dark' | 'light'>(() => {
  return isDark.value ? 'dark' : 'light'
})
let p5Instance = $ref<p5 | null>(null)
let fn = $ref<MathFn>(() => 0)
let time = $ref(0)
let highlightPoint = $ref({
  i: -1,
  x: -1,
  y: -1,
})
let hoveredPointIndex = $ref(-1)
const dots: Dot[] = []

onMounted(() => {
  if (dom) {
    new p5(sketch, dom)
  }
})

watchDebounced(
  () => props.exp,
  (exp: string) => {
    console.log(exp)
    try {
      fn = getMathFn('t, i, x, y', exp)
      restart()
    } catch (e) { }
  },
  { immediate: true, debounce: 500 },
)

watch($$(canvasW), (w) => {
  if (p5Instance && w > 0) {
    p5Instance.resizeCanvas(w, w)
  }
})

const sketch = (s: p5) => {
  s.setup = () => {
    p5Instance = s
    s.createCanvas(canvasW, canvasW)
    s.noStroke()
    s.rectMode(s.RADIUS)
    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        const i = y * 16 + x
        dots.push(new Dot(s, i, x, y))
      }
    }
  }

  s.draw = () => {
    time += s.deltaTime / 1000
    s.background(colors[currentTheme.value].background)

    for (let i = 0; i < dots.length; i++) {
      const [x, y] = dots[i].getXY()
      const value = calc(time, i, x, y)
      dots[i].setValue(value)
    }
  }

  s.mouseMoved = () => {
    if (s.mouseX < 0 || s.mouseX > s.width || s.mouseY < 0 || s.mouseY > s.height) {
      hoveredPointIndex = -1
      return
    }
    const canvasLength = s.width
    const itemLength = canvasLength / 16
    const highlightX = Math.floor(s.mouseX / itemLength)
    const highlightY = Math.floor(s.mouseY / itemLength)
    const highlightI = highlightY * 16 + highlightX
    hoveredPointIndex = highlightI
  }

  s.mouseClicked = () => {
    if (s.width <= 0 || s.mouseX < 0 || s.mouseX > s.width || s.mouseY < 0 || s.mouseY > s.height) {
      return
    }
    const canvasLength = s.width
    const itemLength = canvasLength / 16
    const highlightX = Math.floor(s.mouseX / itemLength)
    const highlightY = Math.floor(s.mouseY / itemLength)
    let highlightI = highlightY * 16 + highlightX
    if (highlightI === highlightPoint.i) {
      highlightI = -1
    }
    highlightPoint = {
      i: highlightI,
      x: highlightX,
      y: highlightY,
    }
  }
}

class Dot {
  s: p5
  i: number
  x: number
  y: number
  constructor(s: p5, i: number ,x: number, y: number) {
    this.s = s
    this.i = i
    this.x = x
    this.y = y
  }

  getXY() {
    return [this.x, this.y]
  }

  setValue(value: number) {
    const canvasLength = this.s.width
    if (value < -1) {
      value = -1
    } else if (value > 1) {
      value = 1
    }

    let opacity = 255
    if (highlightPoint.i !== -1) {
      opacity = 80
      if (highlightPoint.i === this.i) {
        opacity = 255
      } else if (hoveredPointIndex === this.i) {
        opacity = 200
      }
    } else {
      opacity = 200
      if (hoveredPointIndex === this.i) {
        opacity = 255
      }
    }

    const valueColor = value > 0 ? colors[currentTheme.value].plus : colors[currentTheme.value].minus
    const itemLength = canvasLength / 16
    const center = [(this.x + 0.5) * itemLength, (this.y + 0.5) * itemLength]
    this.s.fill([...valueColor, opacity])
    this.s.square(...center as [number, number], 10 * value)
  }
}

function calc(t: number, i: number, x: number, y: number) {
  try {
    return fn(t, i, x, y)
  } catch (e) {
    return 1
  }
}

const restart = () => {
  time = 0
}

defineExpose({
  restart
})

</script>

<template>
  <div ref="dom"></div>
  <Spy
    v-if="highlightPoint.i !== -1"
    :fn="fn"
    :time="time"
    :params="highlightPoint"
    class="mt-8"
  />
</template>
