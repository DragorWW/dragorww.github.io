import { defineConfig } from 'vite'
import { resolve } from 'path'
import {ViteEjsPlugin} from "vite-plugin-ejs";

export default defineConfig({
  plugins: [
    ViteEjsPlugin()
  ],
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true
  },
  server: {
    open: true
  }
}) 