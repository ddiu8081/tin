<script setup lang="ts">
import { onMounted, watch, computed } from 'vue'
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
let p5Instance = $ref<p5 | null>(null)
const { width: canvasW } = $(useElementSize($$(dom)))
const currentTheme = computed<'dark' | 'light'>(() => {
  return isDark.value ? 'dark' : 'light'
})
let fn = $ref<MathFn>(() => 0)
let time = $ref(0)
let highlightPoint = $ref({
  i: -1,
  x: -1,
})
let hoveredPointIndex = $ref(-1)

let dots: Dot[] = []

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
      fn = getMathFn('t, i, x', exp)
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
    for (let x = 0; x < 32; x++) {
      dots.push(new Dot(s, x, x))
    }
  }

  s.draw = () => {
    time += s.deltaTime / 1000
    s.background(colors[currentTheme.value].background)

    for (let i = 0; i < dots.length; i++) {
      const [x] = dots[i].getX()
      const value = calc(time, i, x)
      dots[i].setValue(value)
    }
  }

  s.mouseMoved = () => {
    if (s.mouseX < 0 || s.mouseX > s.width || s.mouseY < 0 || s.mouseY > s.height) {
      hoveredPointIndex = -1
      return
    }
    const x = s.mouseX
    const canvasLength = s.width
    const itemWidth = canvasLength / 32
    let hoveredItemIndex = Math.ceil(x / itemWidth) - 1
    hoveredPointIndex = hoveredItemIndex
  }

  s.mouseClicked = () => {
    if (s.mouseX < 0 || s.mouseX > s.width || s.mouseY < 0 || s.mouseY > s.height) {
      highlightPoint = {
        i: -1,
        x: -1,
      }
      return
    }
    const x = s.mouseX
    const canvasLength = s.width
    const itemWidth = canvasLength / 32
    let clickedItemIndex = Math.ceil(x / itemWidth) - 1
    if (clickedItemIndex === highlightPoint.i) {
      clickedItemIndex = -1
    }
    highlightPoint = {
      i: clickedItemIndex,
      x: clickedItemIndex,
    }
  }
}

class Dot {
  s: p5
  i: number
  x: number
  constructor(s: p5, i: number, x: number) {
    this.s = s
    this.i = i
    this.x = x
  }

  getX() {
    return [this.x] 
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
    const itemWidth = canvasLength / 32
    const itemCenter = [itemWidth * this.x + itemWidth / 2, canvasLength / 2]
    this.s.fill([...valueColor, opacity])
    this.s.rect(...itemCenter as [number, number], itemWidth / 2 - 1, canvasLength / 2 * value)
  }
}

function calc(t: number, i: number, x: number) {
  try {
    return fn(t, i, x)
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
    :params="{ ...highlightPoint, t: time }"
    class="mt-8"
  />
</template>
