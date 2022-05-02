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
      fn = getMathFn('t, i, x, y, z', exp)
      restart()
    } catch (e) { }
  },
  { immediate: true, debounce: 500 },
)

let dots: Dot[] = []
let time = 0

const sketch = (s: p5) => {
  s.setup = () => {
    s.createCanvas(400, 400, s.WEBGL)
    s.normalMaterial()
    // s.debugMode()
    for (let z = 0; z < 16; z++) {
      for (let y = 0; y < 16; y++) {
        for (let x = 0; x < 16; x++) {
          dots.push(new Dot(s, x, y, z))
        }
      }
    }
  }

  s.draw = () => {
    time += s.deltaTime / 1000
    s.background(250)
    s.orbitControl()
    s.rotateY(s.frameCount / 500)
    for (let i = 0; i < dots.length; i++) {
      const [x, y, z] = dots[i].getXYZ()
      const value = calc(time, i, x, y, z)
      dots[i].setValue(value)
    }
    // s.translate(200, 200, 200)
  }
}

class Dot {
  s: p5
  x: number
  y: number
  z: number
  constructor(s: p5, x: number, y: number, z: number) {
    this.s = s
    this.x = x
    this.y = y
    this.z = z
  }

  getXYZ() {
    return [this.x, this.y, this.z]
  }

  setValue(value: number) {
    if (value < -1) {
      value = -1
    } else if (value > 1) {
      value = 1
    }

    const color = value > 0 ? [133, 200, 138] : [110, 110, 110]
    const center = [this.x * 14 - 112, this.y * 14 - 112, this.z * 14 - 112]
    this.s.translate(...center as [number, number, number])
    this.s.fill(...color as [number, number, number], 160)
    this.s.box(10 * value)
    const center2 = [-this.x * 14 + 112, -this.y * 14 + 112, -this.z * 14 + 112]
    this.s.translate(...center2 as [number, number, number])
  }
}

function calc(t: number, i: number, x: number, y: number, z: number) {
  try {
    return fn(t, i, x, y, z)
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
