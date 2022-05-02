<script setup lang="ts">
import { markRaw } from 'vue'
import { useToggle } from '@vueuse/core'

import X from './components/canvas/X.vue'
import XY from './components/canvas/XY.vue'
import Footer from './components/Footer.vue';

const paramList: IndexExpressionItem[] = [
  {
    text: 't, i, x',
    canvas: markRaw(X),
    defaultExp: 'sin(t)',
  }, {
    text: 't, i, x, y',
    canvas: markRaw(XY),
    defaultExp: 'sin(2*t)',
  }, {
    text: 't, i, x, y, z',
    canvas: markRaw(XY),
    defaultExp: 'sin(3*t)',
  }
]

let expression = $ref('sin(t)')
let currentParam = $ref(paramList[1])
const [dropDownOpen, toggleDropdown] = useToggle()

const setExpression = (exp: IndexExpressionItem) => {
  expression = exp.defaultExp
  currentParam = exp
  toggleDropdown()
}
</script>

<template>
  <div m="x-auto y-24" class="w-[400px]">
    <component :is="currentParam.canvas" :exp="expression"></component>
    <div mt-12 text-left px-3>
      <div relative text-sm select-none class="-mx-2">
        <span @click="toggleDropdown()" p="x-2 y-1.5" rounded-md cursor-pointer op-50 hover="bg-gray-100 op-80">({{currentParam.text}})</span>
        <span class="ml-1" op-50>=></span>
        <div v-show="dropDownOpen"
          absolute top-full mt-2 py-2
          rounded-md shadow-md bg-white
          border border-gray-100
        >
          <div
            v-for="param in paramList"
            @click="setExpression(param)"
            px-3 py-2 cursor-pointer hover="bg-gray-100"
          >
            {{ param.text }}
          </div>
        </div>
      </div>
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
