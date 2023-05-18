import { defineConfig, presetAttributify, presetUno, transformerAttributifyJsx } from 'unocss'

export default defineConfig({
  presets: [
    presetAttributify(),
    presetUno(),
  ],
  transformers: [
    transformerAttributifyJsx(),
  ],
  include: ['./**/*.{html,ts,tsx}'],
})
