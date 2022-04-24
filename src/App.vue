<script setup lang="ts">
import { watch } from 'vue'
import { useThrottle } from '@vueuse/core'
import Canvas from './components/Canvas.vue'

const canvas = $ref<typeof Canvas | null>(null)
const expression = $ref('sin(t)')
const thorrtled = useThrottle($$(expression), 500)

const MathContext = `const {${Object.getOwnPropertyNames(Math).join(',')}}=Math`
let fn = $ref((t: number, i: number, x: number, y: number) => 0)

watch(
  thorrtled,
  (exp, prev) => {
    const formatExp = `()=>{
      ${MathContext};
      return (t,i,x,y) => {
        return ${exp.replace(/(\d+)(\w+)/g, (_, n, x) => `${n} * ${x}`)}
      }
    }`
    try {
      fn = eval(formatExp)()
      if (canvas) {
        canvas.restart()
      }
    } catch (e) {}
  },
  { immediate: true },
)
</script>

<template>
  <Canvas ref="canvas" :fn="fn" :exp="thorrtled" />
  <div>
    <p>(t, i, x, y) =></p>
    <input v-model="expression" autocomplete="false" spellcheck="false" />
  </div>
</template>
