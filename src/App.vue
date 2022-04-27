<script setup lang="ts">
import { watch } from 'vue'
import { useThrottle } from '@vueuse/core'
import Canvas from './components/Canvas.vue'
import Footer from './components/Footer.vue';

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
  <div m="x-auto y-24" class="w-[400px]">
    <Canvas ref="canvas" :fn="fn" :exp="thorrtled" />
    <div mt-12 text-left px-3>
      <p text-sm op-50 m-0>(t, i, x, y) =></p>
      <input
        text-xl font-600
        py-2 mt-1
        w-full
        border="b gray-300"
        bg-transparent
        outline-0
        v-model="expression"
        autocomplete="false"
        spellcheck="false"
      />
    </div>
    <Footer px-3 mt-8 />
  </div>
</template>

<style>
body {
  background-color: #fafafa;
}
</style> 
