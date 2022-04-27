<script setup lang="ts">
import XY from './components/canvas/XY.vue'
import Footer from './components/Footer.vue';

const expression = $ref('sin(t)')
</script>

<template>
  <div m="x-auto y-24" class="w-[400px]">
    <XY :exp="expression" />
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
  font-family: 'Fira Code', monospace;
}
</style> 
