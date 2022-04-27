<script setup lang="ts">
import { onMounted } from 'vue'
import { watchDebounced } from '@vueuse/core'
import { getMathFn } from '@/utils'
import p5 from 'p5'

interface Props {
  exp: string
}

const props = defineProps<Props>()

const dom = $ref(null)
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
    s.createCanvas(400, 400)
    s.noStroke()
    s.rectMode(s.RADIUS)
    for (let x = 0; x < 32; x++) {
      dots.push(new Dot(s, x))
    }
  }

  s.draw = () => {
    time += 1 / 60
    s.background(250)

    for (let i = 0; i < dots.length; i++) {
      const [x] = dots[i].getX()
      const value = calc(time, i, x)
      dots[i].setValue(value)
    }
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
    if (value < -1) {
      value = -1
    } else if (value > 1) {
      value = 1
    }

    const color = value > 0 ? [133, 200, 138] : [110, 110, 110]
    const center = [this.x * 12 + 20, 200]
    this.s.fill(...color as [number, number, number])
    this.s.rect(...center as [number, number], 5, 160 * value)
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
  if (dom) {
    new p5(sketch, dom)
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
</template>
