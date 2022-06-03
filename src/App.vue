<script setup lang="ts">
import { markRaw } from 'vue'
import { useToggle } from '@vueuse/core'

import X from './components/canvas/X.vue'
import XY from './components/canvas/XY.vue'
import XYZ from './components/canvas/XYZ.vue'
import Footer from './components/Footer.vue'

const paramList: IndexExpressionItem[] = [
  {
    text: 't, i, x',
    canvas: markRaw(X),
    defaultExp: 'sin(t)',
  }, {
    text: 't, i, x, y',
    canvas: markRaw(XY),
    defaultExp: 'sin(t)',
  }, {
    text: 't, i, x, y, z',
    canvas: markRaw(XYZ),
    defaultExp: 'sin(t)',
  }
]

let expression = $ref('sin(t + i/5)')
let currentParam = $ref(paramList[0])
const [dropDownOpen, toggleDropdown] = useToggle()

const setExpression = (exp: IndexExpressionItem) => {
  expression = exp.defaultExp
  currentParam = exp
  toggleDropdown()
}
</script>

<template>
  <div class="mx-auto my-24 max-w-[400px] px-6">
    <component :is="currentParam.canvas" :exp="expression"></component>
    <div class="mt-12 text-left px-3">
      <div class="relative -mx-2 text-sm select-none">
        <span
          @click="toggleDropdown()"
          class="x-2 y-1.5 rounded-md cursor-pointer op-50 hover:bg-gray-100 hover:op-80"
        >
          ({{currentParam.text}})
        </span>
        <span class="ml-1 op-50">=></span>
        <div
          v-show="dropDownOpen"
          class="absolute top-full mt-2 py-2 rounded-md shadow-md bg-white border border-gray-100"
        >
          <div
            v-for="param in paramList"
            @click="setExpression(param)"
            class="px-3 py-2 cursor-pointer hover:bg-gray-100"
          >
            {{ param.text }}
          </div>
        </div>
      </div>
      <input
        class="text-xl font-600 py-2 mt-1 w-full bg-transparent outline-0 border-b border-gray-400/50"
        v-model="expression"
        autocomplete="false"
        spellcheck="false"
      />
    </div>
    <Footer px-3 mt-8 />
  </div>
</template>

<style>
html {
  background-color: #fafafa;
}

html.dark {
  background-color: #1e1e1e;
}

body {
  font-family: 'Fira Code', monospace;
}
</style> 
