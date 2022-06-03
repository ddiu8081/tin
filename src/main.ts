import { createApp } from 'vue'
import App from './App.vue'

import '@unocss/reset/tailwind.css'
import 'uno.css'
import './assets/font.css'

// dark mode
(function() {
  const darkSchema = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  document.documentElement.classList.toggle('dark', darkSchema)
})()

createApp(App).mount('#app')
