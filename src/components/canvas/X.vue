<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { watchDebounced, useElementSize } from '@vueuse/core'
import p5 from 'p5'

import { getMathFn, isDarkMode } from '@/utils'
import colors from '@/colors'

interface Props {
  exp: string
}

const props = defineProps<Props>()

const dom = ref(null)
const { width } = useElementSize(dom)
let fn = $ref<MathFn>(() => 0)

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

let dots: Dot[] = []
let time = 0

const sketch = (s: p5) => {
  s.setup = () => {
    s.createCanvas(width.value, width.value)
    s.noStroke()
    s.rectMode(s.RADIUS)
    for (let x = 0; x < 32; x++) {
      dots.push(new Dot(s, x))
    }
  }

  s.draw = () => {
    time += s.deltaTime / 1000
    const isDark = isDarkMode()
    s.background(isDark ? '#1e1e1e' : '#fafafa')

    for (let i = 0; i < dots.length; i++) {
      const [x] = dots[i].getX()
      const value = calc(time, i, x)
      dots[i].setValue(value)
    }
  }

  s.windowResized = () => {
    s.resizeCanvas(width.value, width.value)
  }
}

class Dot {
  s: p5
  x: number
  constructor(s: p5, x: number) {
    this.s = s
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

    const color = value > 0 ? colors.plus : colors.minus
    const itemWidth = canvasLength / 32
    const itemCenter = [itemWidth * this.x + itemWidth / 2, canvasLength / 2]
    this.s.fill(color)
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

onMounted(() => {
  if (dom.value) {
    new p5(sketch, dom.value)
  }
})

const restart = () => {
  time = 0
}

defineExpose({
  restart
})

</script>

<template>
  <div ref="dom" class="w-full h-full border border-gray-100"></div>
</template>
