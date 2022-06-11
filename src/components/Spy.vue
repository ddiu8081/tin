<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useElementSize } from '@vueuse/core'
import p5 from 'p5'

import { isDark } from '@/utils'
import colors from '@/colors'

interface Props {
  fn: MathFn
  params: {
    t: number
    i: number
    x: number
  }
}

const props = defineProps<Props>()

// todo: fix ts warning
const parsedValue: { [key: string]: any } = computed(() => {
  const { fn, params } = props
  return {
    t: params.t,
    i: params.i,
    x: params.x,
    v: fn(params.t, params.i, params.x),
  }
})
const spyCanvas = $ref(null)
let p5Instance = $ref<p5 | null>(null)
const { width: canvasW } = $(useElementSize($$(spyCanvas)))
const currentTheme = computed<'dark' | 'light'>(() => {
  return isDark.value ? 'dark' : 'light'
})

onMounted(() => {
  if (!spyCanvas) {
    return
  }
  new p5(sketch, spyCanvas)
})

watch($$(canvasW), (w) => {
  if (p5Instance && w > 0) {
    p5Instance.resizeCanvas(w, 100)
  }
})

const sketch = (s: p5) => {
  s.setup = () => {
    p5Instance = s
    s.createCanvas(canvasW, 100)
    s.noStroke()
    s.rectMode(s.RADIUS)
  }

  s.draw = () => {
    s.background(colors[currentTheme.value].background)
    s.stroke(colors[currentTheme.value].foreground, 50)
    s.strokeWeight(1)
    s.line(0, 50, 350, 50)
    s.line(200, 0, 200, 100)
    for (let i = 0; i < 350; i++) {
      const dotTime = parsedValue.value.t + (i - 200) / 30
      const dotValue = props.fn(dotTime, parsedValue.value.i, parsedValue.value.x)
      if (i > 200) {
        s.stroke(colors[currentTheme.value].foreground, 50)
      } else {
        s.stroke(colors[currentTheme.value].foreground)
      }
      s.point(i, 50 - dotValue * 40)
    }

    s.stroke(colors[currentTheme.value].foreground)
    s.strokeWeight(4)
    s.point(200, 50 - parsedValue.value.v * 40)
  }
}

</script>

<template>
  <div>
    <div class="flex gap-2">
      <div v-for="key in Object.keys(parsedValue)">
        <div v-if="key !== 'v'" class="op-70">
          <span class="text-xs">{{ key }}=</span>
          <span class="text-xs">{{ parsedValue[key].toFixed(2) }}</span>    
        </div>
      </div>
      <div class="flex-1"></div>
      <div>
        <span class="text-xs font-bold">value=</span>
        <span class="text-xs">{{ parsedValue.v.toFixed(2) }}</span>
      </div>
    </div>
    <div ref="spyCanvas" class="border border-gray-500"></div>
  </div>
</template>