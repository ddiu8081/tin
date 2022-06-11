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
// let highlightPoint = $ref({
//   i: -1,
//   x: -1,
//   y: -1,
//   z: -1,
// })
// let hoveredPointIndex = $ref(-1)
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
      fn = getMathFn('t, i, x, y, z', exp)
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
    s.createCanvas(canvasW, canvasW, s.WEBGL)
    s.normalMaterial()
    for (let z = 0; z < 16; z++) {
      for (let y = 0; y < 16; y++) {
        for (let x = 0; x < 16; x++) {
          const i = x + y * 16 + z * 256
          dots.push(new Dot(s, i, x, y, z))
        }
      }
    }
  }

  s.draw = () => {
    time += s.deltaTime / 1000
    s.background(colors[currentTheme.value].background)
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
  i: number
  x: number
  y: number
  z: number
  constructor(s: p5, i: number, x: number, y: number, z: number) {
    this.s = s
    this.i = i
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

    const valueColor = value > 0 ? colors[currentTheme.value].plus : colors[currentTheme.value].minus
    const center = [this.x * 14 - 112, this.y * 14 - 112, this.z * 14 - 112]
    this.s.translate(...center as [number, number, number])
    this.s.fill(...valueColor, 180)
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

const restart = () => {
  time = 0
}

defineExpose({
  restart
})

</script>

<template>
  <div ref="dom"></div>
  <!-- <Spy
    v-if="highlightPoint.i !== -1"
    :fn="fn"
    :time="time"
    :params="highlightPoint"
    class="mt-8"
  /> -->
</template>
