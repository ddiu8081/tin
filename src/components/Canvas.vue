<script setup lang="ts">
import { onMounted } from 'vue'
import p5 from 'p5'

interface Props {
  fn: (t: number, i: number, x: number, y: number) => number
  exp: string
}

const props = defineProps<Props>()

const dom = $ref(null)

let dots: Dot[] = []
let time = 0

const sketch = (s: p5) => {
  s.setup = () => {
    s.createCanvas(400, 400)
    s.noStroke()
    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        dots.push(new Dot(s, x, y))
      }
    }
  }

  s.draw = () => {
    time += 1 / 60
    s.background(250)

    for (let i = 0; i < dots.length; i++) {
      const [x, y] = dots[i].getXY()
      const value = calc(time, i, x, y)
      dots[i].setValue(value)
    }
  }
}

class Dot {
  s: p5
  x: number
  y: number
  constructor(s: p5, x: number, y: number) {
    this.s = s
    this.x = x
    this.y = y
  }

  getXY() {
    return [this.x, this.y]
  }

  setValue(value: number) {
    if (value < -1) {
      value = -1
    } else if (value > 1) {
      value = 1
    }

    const color = value > 0 ? [133, 200, 138] : [110, 110, 110]
    const center = [this.x * 24 + 20, this.y * 24 + 20]
    this.s.fill(...color as [number, number, number])
    this.s.circle(...center as [number, number], 20 * value)
  }
}

function calc(t: number, i: number, x: number, y: number) {
  try {
    return props.fn(t, i, x, y)
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
  console.log('restart')
  time = 0
  console.log(props.fn)
}

defineExpose({
  restart
})

</script>

<template>
  <div ref="dom"></div>
</template>
