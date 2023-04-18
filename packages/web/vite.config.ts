import { defineConfig } from 'vite'
import UnoCSS from 'unocss/vite'
import React from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    React(),
    UnoCSS(),
  ],
})
