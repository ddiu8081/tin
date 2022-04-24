import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Unocss from 'unocss/vite'

import { presetUno } from 'unocss'
import presetAttributify from '@unocss/preset-attributify'

export default defineConfig({
  plugins: [
    vue({
      reactivityTransform: true,
    }),
    Unocss({
      presets: [
        presetUno(),
        presetAttributify(),
      ],
    }),
  ],
})
