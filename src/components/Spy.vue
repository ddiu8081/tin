<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useElementSize } from '@vueuse/core'
import p5 from 'p5'

import { isDark } from '@/utils'
import colors from '@/colors'

interface Props {
  fn: MathFn
  time: number
  params: {
    [key: string]: number
  }
}

const props = defineProps<Props>()

const currentValue = computed(() => {
  const { fn, time, params } = props
  return fn(time, params.i, params.x, params.y, params.z)
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
      const dotTime = props.time + (i - 200) / 30
      const dotValue = props.fn(dotTime, props.params.i, props.params.x, props.params.y, props.params.z)
      if (i > 200) {
        s.stroke(colors[currentTheme.value].foreground, 50)
      } else {
        s.stroke(colors[currentTheme.value].foreground)
      }
      s.point(i, 50 - dotValue * 50)
    }

    s.stroke(colors[currentTheme.value].foreground)
    s.strokeWeight(4)
    s.point(200, 50 - currentValue.value * 50)
  }
}

</script>

<template>
  <div>
    <div class="flex justify-between items-end mb-1">
      <div>
        <div class="op-70">
          <span class="text-xs">t=</span>
          <span class="text-xs">{{ props.time.toFixed(2) }}</span>
        </div>
        <div class="flex gap-2 -mt-1">
          <div v-for="key in Object.keys(props.params)">
            <div class="op-70">
              <span class="text-xs">{{ key }}=</span>
              <span class="text-xs">{{ props.params[key] }}</span>    
            </div>
          </div>
        </div>
      </div>
      <div>
        <span class="text-xs font-bold">value=</span>
        <span class="text-xs">{{ currentValue.toFixed(2) }}</span>
      </div>
    </div>
    <div ref="spyCanvas" class="border border-gray-400 dark:border-truegray-600"></div>
  </div>
</template>