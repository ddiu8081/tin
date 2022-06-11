<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { watchDebounced, useElementSize } from '@vueuse/core'
import p5 from 'p5'

import { getMathFn, isDark } from '@/utils'
import colors from '@/colors'
import Spy from '@/components/Spy.vue'

interface Props {
  exp: string
}

const props = defineProps<Props>()

const dom = ref(null)
let p5Instance = $ref<p5 | null>(null)
const { width: canvasW } = $(useElementSize(dom))
let fn = $ref<MathFn>(() => 0)
let time = $ref(0)
let highlightPoint = $ref({
  i: -1,
  x: -1,
})

let dots: Dot[] = []

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
    s.background(isDark.value ? '#1e1e1e' : '#fafafa')

    for (let i = 0; i < dots.length; i++) {
      const [x] = dots[i].getX()
      const value = calc(time, i, x)
      dots[i].setValue(value)
    }
  }

  s.mouseClicked = () => {
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

    const theme = isDark.value ? 'dark' : 'light'
    const valueColor = value > 0 ? colors[theme].plus : colors[theme].minus
    const itemWidth = canvasLength / 32
    const itemCenter = [itemWidth * this.x + itemWidth / 2, canvasLength / 2]
    this.s.fill(highlightPoint.i < 0 || this.i === highlightPoint.i ? valueColor : [...valueColor, 80])
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
  <div ref="dom"></div>
  <Spy
    v-if="highlightPoint.i >= 0"
    :fn="fn"
    :params="{ ...highlightPoint, t: time }"
    class="mt-8"
  />
</template>
