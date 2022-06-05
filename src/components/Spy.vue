<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useElementSize } from '@vueuse/core'
import p5 from 'p5'

import { isDark } from '@/utils'

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
const { width } = useElementSize(spyCanvas)

onMounted(() => {
  if (!spyCanvas) {
    return
  }
  new p5(sketch, spyCanvas)
})

const sketch = (s: p5) => {
  s.setup = () => {
    s.createCanvas(350, 100)
    s.noStroke()
    s.rectMode(s.RADIUS)
  }

  s.draw = () => {
    s.background(isDark.value ? '#1e1e1e' : '#fafafa')

    // draw a line of the fn
    s.stroke('#666666')
    s.line(0, 50, 350, 50)
    s.fill('#fc915390')
    for (let i = 0; i < 350; i++) {
      const dotTime = parsedValue.value.t + (i - 180) / 30
      const dotValue = props.fn(dotTime, parsedValue.value.i, parsedValue.value.x)
      s.circle(i, 50 - dotValue * 40, 2)
    }
    // current dot
    s.fill('#fc9153')
    s.circle(180, 50 - parsedValue.value.v * 40, 8)
  }

  s.windowResized = () => {
    s.resizeCanvas(width.value, width.value)
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