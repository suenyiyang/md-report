import { defineConfig } from 'vite'
import UnoCSS from 'unocss/vite'
import React from '@vitejs/plugin-react'
import SvgR from 'vite-plugin-svgr'
import ViteTsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    SvgR(),
    React(),
    UnoCSS(),
    ViteTsconfigPaths(),
  ],
})
